import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function isHttpUrl(input: string): boolean {
  try {
    const u = new URL(input);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();

  // localhost系
  if (h === "localhost" || h.endsWith(".localhost")) return true;

  // ループバック/リンクローカル/プライベートっぽい文字列（簡易）
  if (h === "127.0.0.1" || h === "0.0.0.0") return true;
  if (h.startsWith("10.")) return true;
  if (h.startsWith("192.168.")) return true;
  if (h.startsWith("172.")) {
    // 172.16.0.0/12 簡易判定
    const parts = h.split(".");
    const second = Number(parts[1]);
    if (!Number.isNaN(second) && second >= 16 && second <= 31) return true;
  }
  // IPv6 localhost
  if (h === "::1") return true;

  // クラウドメタデータ等（代表例）
  if (h === "169.254.169.254") return true;

  return false;
}

/** HTMLから<title>を雑に抽出（複雑なケースは別途DOMパース推奨） */
function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return decodeHtmlEntities(m[1].trim()).slice(0, 200);
}

function extractFaviconHref(html: string): string | null {
  const relPriority = [
    "icon",
    "shortcut icon",
    "apple-touch-icon",
    "apple-touch-icon-precomposed",
  ];

  // <link ...> をざっくり全取得
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);

  type Candidate = { rel: string; href: string };
  const candidates: Candidate[] = [];

  for (const tag of links) {
    const rel = (tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] ?? "")
      .toLowerCase().trim();
    const href = (tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] ?? "")
      .trim();
    if (!rel || !href) continue;

    // rel="icon" 以外でも "icon" を含むことがある
    if (rel.includes("icon")) {
      candidates.push({ rel, href });
      continue;
    }
    if (relPriority.includes(rel)) {
      candidates.push({ rel, href });
      continue;
    }
  }

  // 優先順で並べる
  candidates.sort((a, b) => {
    const ai = relPriority.indexOf(a.rel);
    const bi = relPriority.indexOf(b.rel);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return candidates[0]?.href ?? null;
}

/** 相対URLを絶対URLにする */
function resolveUrl(baseUrl: string, maybeRelative: string): string {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return maybeRelative; // 最後の手段
  }
}

/** HTMLエンティティを最低限デコード（必要なら拡張） */
function decodeHtmlEntities(s: string): string {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

/** fetchにタイムアウトとサイズ制限を付与 */
async function fetchHtmlWithLimits(
  url: string,
  timeoutMs = 8000,
  maxBytes = 512_000,
) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // サイトによってはUAで挙動が変わるので最低限入れる
        "User-Agent": "meta-extractor/1.0",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    const finalUrl = res.url;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/html")) {
      // HTML以外でも<title>が欲しいなら外す
      throw new Error(`Not HTML content-type: ${contentType}`);
    }

    // ストリームでmaxBytesまで読む（読みすぎ防止）
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const chunks: Uint8Array[] = [];
    let total = 0;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > maxBytes) {
        throw new Error(`HTML too large (>${maxBytes} bytes)`);
      }
      chunks.push(value);
    }

    const all = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      all.set(c, offset);
      offset += c.byteLength;
    }

    const html = new TextDecoder().decode(all);
    return { html, finalUrl };
  } finally {
    clearTimeout(t);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  const requestUrl = new URL(req.url);
  const url = requestUrl.searchParams.get("url");
  const token = requestUrl.searchParams.get("token");

  if (!url || !token) {
    return new Response(
      JSON.stringify({ error: "url and token are required" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  if (!isHttpUrl(url)) {
    return new Response(
      JSON.stringify({ error: "url is required (http/https)" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  const u = new URL(url);
  if (isBlockedHost(u.hostname)) {
    return new Response(JSON.stringify({ error: "blocked host" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  console.log("supabaseClient", supabaseClient);

  try {
    const { data, error } = await supabaseClient
      .from("api_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error) throw error;
    if (!data) throw new Error("token not found");

    const { html, finalUrl } = await fetchHtmlWithLimits(url);

    const title = extractTitle(html) ?? "";
    const faviconHref = extractFaviconHref(html);
    const favIconUrl = faviconHref
      ? resolveUrl(finalUrl, faviconHref)
      : resolveUrl(finalUrl, "/favicon.ico");

    console.log("title", title);
    console.log("favIconUrl", favIconUrl);

    const { error: itemError } = await supabaseClient.from("items").insert({
      uuid: data.uuid,
      url,
      title,
      favIconUrl,
    });

    if (itemError) throw itemError;

    return new Response(
      JSON.stringify({
        title,
        favIconUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify(error.message),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
