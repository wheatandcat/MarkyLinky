const CREATE_ITEM_ENDPOINT = import.meta.env.VITE_CREATE_ITEM_ENDPOINT as
  | string
  | undefined;

export type CreateItemResult = {
  title: string;
  favIconUrl: string | null;
};

export async function createItem(
  url: string,
  token: string,
): Promise<CreateItemResult> {
  if (!CREATE_ITEM_ENDPOINT) {
    throw new Error("VITE_CREATE_ITEM_ENDPOINT is not configured");
  }

  const endpoint = new URL(CREATE_ITEM_ENDPOINT);
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("token", token);

  const res = await fetch(endpoint.toString());
  const body = await res.json();

  if (!res.ok || body?.error) {
    const message =
      typeof body === "string"
        ? body
        : (body?.error ?? "登録に失敗しました");
    throw new Error(message);
  }

  return {
    title: body.title ?? "",
    favIconUrl: body.favIconUrl ?? null,
  };
}
