import { isSupportedBrowser } from "./lib/platform";
import { registerServiceWorker } from "./lib/registerSw";
import { clearApiKey, getApiKey, setApiKey } from "./lib/storage";

const unsupportedEl = document.querySelector<HTMLDivElement>("#unsupported")!;
const mainEl = document.querySelector<HTMLDivElement>("#main")!;

async function init() {
  if (!(await isSupportedBrowser())) {
    unsupportedEl.hidden = false;
    return;
  }
  mainEl.hidden = false;

  registerServiceWorker();

  const apiKeyInput = document.querySelector<HTMLInputElement>("#apiKey")!;
  const saveButton = document.querySelector<HTMLButtonElement>("#save")!;
  const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
  const statusEl = document.querySelector<HTMLParagraphElement>("#status")!;

  function showStatus(message: string, kind: "success" | "error") {
    statusEl.textContent = message;
    statusEl.className = `status ${kind}`;
  }

  const savedKey = getApiKey();
  if (savedKey) {
    apiKeyInput.value = savedKey;
    showStatus("APIキーは保存済みです", "success");
  }

  saveButton.addEventListener("click", () => {
    const value = apiKeyInput.value.trim();
    if (!value) {
      showStatus("APIキーを入力してください", "error");
      return;
    }
    setApiKey(value);
    showStatus("保存しました", "success");
  });

  clearButton.addEventListener("click", () => {
    clearApiKey();
    apiKeyInput.value = "";
    showStatus("削除しました", "success");
  });
}

init();
