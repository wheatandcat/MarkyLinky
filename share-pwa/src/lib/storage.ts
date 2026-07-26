const API_KEY_STORAGE_KEY = "markylinky.apiKey";

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function setApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/** 先頭4文字・末尾4文字以外を*でマスクする */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return "*".repeat(apiKey.length);

  const head = apiKey.slice(0, 4);
  const tail = apiKey.slice(-4);
  const masked = "*".repeat(apiKey.length - 8);
  return `${head}${masked}${tail}`;
}
