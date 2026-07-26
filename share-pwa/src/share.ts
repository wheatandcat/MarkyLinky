import { createItem } from "./lib/createItem";
import { extractUrl } from "./lib/extractUrl";
import { isSupportedBrowser } from "./lib/platform";
import { registerServiceWorker } from "./lib/registerSw";
import { getApiKey } from "./lib/storage";

const unsupportedEl = document.querySelector<HTMLDivElement>("#unsupported")!;
const mainEl = document.querySelector<HTMLDivElement>("#main")!;

function showError(statusEl: HTMLParagraphElement, message: string) {
  statusEl.textContent = message;
  statusEl.className = "status error";
}

function showSuccess(
  statusEl: HTMLParagraphElement,
  resultEl: HTMLDivElement,
  title: string,
  favIconUrl: string | null,
) {
  statusEl.textContent = "登録しました";
  statusEl.className = "status success";

  resultEl.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "result";

  if (favIconUrl) {
    const img = document.createElement("img");
    img.src = favIconUrl;
    img.alt = "";
    wrapper.appendChild(img);
  }

  const titleEl = document.createElement("span");
  titleEl.textContent = title || "(タイトルなし)";
  wrapper.appendChild(titleEl);

  resultEl.appendChild(wrapper);
}

async function init() {
  if (!(await isSupportedBrowser())) {
    unsupportedEl.hidden = false;
    return;
  }
  mainEl.hidden = false;

  registerServiceWorker();

  const statusEl = document.querySelector<HTMLParagraphElement>("#status")!;
  const resultEl = document.querySelector<HTMLDivElement>("#result")!;

  const params = new URLSearchParams(location.search);
  const url = extractUrl({
    url: params.get("url"),
    text: params.get("text"),
    title: params.get("title"),
  });

  if (!url) {
    showError(statusEl, "共有内容からURLを取得できませんでした");
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    showError(
      statusEl,
      "APIキーが未設定です。設定画面でAPIキーを保存してください",
    );
    return;
  }

  try {
    const item = await createItem(url, apiKey);
    showSuccess(statusEl, resultEl, item.title, item.favIconUrl);
  } catch (error) {
    showError(
      statusEl,
      error instanceof Error ? error.message : "登録に失敗しました",
    );
  }
}

init();
