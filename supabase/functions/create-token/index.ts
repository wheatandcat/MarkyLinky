import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function toBase64Url(bytes: Uint8Array): string {
  const b64 = btoa(String.fromCharCode(...bytes));
  return b64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function generateApiKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

function isPostgrestError(err: unknown): err is {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
} {
  return typeof err === "object" && err !== null && "message" in err;
}

function getErrorMessage(err: unknown): string {
  if (isPostgrestError(err) && typeof err.message === "string") {
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

function isUniqueViolation(err: unknown): boolean {
  return isPostgrestError(err) && err.code === "23505";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }
  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const { title } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({
          error: "title is required and must be a non-empty string",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authorizationHeader } },
      },
    );

    const { data: userData, error: userError } = await supabaseClient.auth
      .getUser(token);
    if (userError) throw userError;

    const user = userData?.user;
    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const maxRetries = 5;

    for (let i = 0; i < maxRetries; i++) {
      const apiKey = generateApiKey();

      try {
        const { error } = await supabaseClient
          .from("api_tokens")
          .insert({
            uuid: user.id,
            title, // ← Request由来の title
            token: apiKey,
          })
          .select("token")
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({
            token: apiKey,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      } catch (err) {
        if (isUniqueViolation(err)) continue;
        return new Response(
          JSON.stringify({ error: getErrorMessage(err) }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "could_not_generate_unique_key" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
