import { setupInstallButton } from "./lib/installPrompt";
import {
  isStandaloneDisplayMode,
  isSupportedBrowser,
} from "./lib/platform";
import { registerServiceWorker } from "./lib/registerSw";
import { clearApiKey, getApiKey, maskApiKey, setApiKey } from "./lib/storage";

const unsupportedEl = document.querySelector<HTMLDivElement>("#unsupported")!;
const notInstalledEl =
  document.querySelector<HTMLDivElement>("#notInstalled")!;
const mainEl = document.querySelector<HTMLDivElement>("#main")!;

async function init() {
  if (!(await isSupportedBrowser())) {
    unsupportedEl.hidden = false;
    return;
  }
  if (!isStandaloneDisplayMode()) {
    notInstalledEl.hidden = false;
    const installButton =
      document.querySelector<HTMLButtonElement>("#installApp")!;
    const installStatusEl =
      document.querySelector<HTMLParagraphElement>("#installStatus")!;
    setupInstallButton(installButton, installStatusEl);
    return;
  }
  mainEl.hidden = false;

  registerServiceWorker();

  const keyFormEl = document.querySelector<HTMLDivElement>("#keyForm")!;
  const keyDisplayEl = document.querySelector<HTMLDivElement>("#keyDisplay")!;
  const maskedKeyEl = document.querySelector<HTMLParagraphElement>(
    "#maskedKey",
  )!;
  const apiKeyInput = document.querySelector<HTMLInputElement>("#apiKey")!;
  const saveButton = document.querySelector<HTMLButtonElement>("#save")!;
  const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
  const statusEl = document.querySelector<HTMLParagraphElement>("#status")!;

  function showStatus(message: string, kind: "success" | "error") {
    statusEl.textContent = message;
    statusEl.className = `status ${kind}`;
  }

  function render() {
    const savedKey = getApiKey();
    if (savedKey) {
      keyFormEl.hidden = true;
      keyDisplayEl.hidden = false;
      maskedKeyEl.textContent = maskApiKey(savedKey);
    } else {
      keyFormEl.hidden = false;
      keyDisplayEl.hidden = true;
      apiKeyInput.value = "";
    }
  }

  render();

  saveButton.addEventListener("click", () => {
    const value = apiKeyInput.value.trim();
    if (!value) {
      showStatus("APIキーを入力してください", "error");
      return;
    }
    setApiKey(value);
    showStatus("保存しました", "success");
    render();
  });

  clearButton.addEventListener("click", () => {
    clearApiKey();
    showStatus("削除しました", "success");
    render();
  });
}

init();
