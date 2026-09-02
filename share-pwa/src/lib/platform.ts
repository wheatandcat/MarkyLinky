// AndroidでWebAPKを発行できる（＝共有シートにPWAを登録できる）のは実質Google Chromeのみ。
// Braveなど他のChromium系ブラウザはWebAPK minting serviceを利用できないため、
// 「アプリをインストール」してもホーム画面ショートカット止まりで共有ターゲットとして動作しない。
const IMPERSONATOR_TOKENS =
  /EdgA|EdgiOS|OPR\/|Opera|SamsungBrowser|Vivaldi|YaBrowser|UCBrowser|MiuiBrowser|HeyTapBrowser|Brave/i;

function hasChromeLikeUserAgent(ua: string): boolean {
  return /Chrome\//.test(ua) && !IMPERSONATOR_TOKENS.test(ua);
}

type BraveNavigator = Navigator & {
  brave?: { isBrave?: () => Promise<boolean> };
};

async function isBraveBrowser(): Promise<boolean> {
  const brave = (navigator as BraveNavigator).brave;
  if (!brave?.isBrave) return false;
  try {
    return await brave.isBrave();
  } catch {
    return false;
  }
}

/**
 * Android + Chrome 以外では share_target が機能しないため、
 * このアプリの機能を使わせてよいかどうかを判定する。
 */
export async function isSupportedBrowser(): Promise<boolean> {
  const ua = navigator.userAgent;

  if (!/Android/.test(ua)) return false;
  if (!hasChromeLikeUserAgent(ua)) return false;
  if (navigator.vendor !== "Google Inc.") return false;
  if (await isBraveBrowser()) return false;

  return true;
}

/**
 * ホーム画面に追加したアプリ（WebAPK）として起動しているかどうか。
 * ブラウザのタブで開いているだけの場合はfalseになる。
 */
export function isStandaloneDisplayMode(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}
