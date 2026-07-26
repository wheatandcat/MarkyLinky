const URL_PATTERN = /https?:\/\/\S+/;

function isHttpUrl(input: string): boolean {
  try {
    const u = new URL(input);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** 共有インテントの url/text/title からhttp(s) URLを抽出する */
export function extractUrl(params: {
  url: string | null;
  text: string | null;
  title: string | null;
}): string | null {
  const candidates = [params.url, params.text, params.title];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (isHttpUrl(candidate)) return candidate;

    const match = candidate.match(URL_PATTERN);
    if (match && isHttpUrl(match[0])) return match[0];
  }

  return null;
}
