interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const availableListeners = new Set<() => void>();

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  for (const listener of availableListeners) listener();
});

function onInstallPromptAvailable(callback: () => void): void {
  if (deferredPrompt) {
    callback();
    return;
  }
  availableListeners.add(callback);
}

/** ボタンクリックで「アプリをインストール」ダイアログを出す配線をする */
export function setupInstallButton(
  button: HTMLButtonElement,
  statusEl: HTMLElement,
): void {
  onInstallPromptAvailable(() => {
    button.hidden = false;
  });

  button.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt;
    deferredPrompt = null;
    button.hidden = true;

    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    statusEl.textContent =
      outcome === "accepted"
        ? "インストールしました。ホーム画面に追加されたアイコンから開き直してください。"
        : "インストールがキャンセルされました。";
    statusEl.className = "status";
  });
}
