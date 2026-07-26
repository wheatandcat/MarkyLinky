# MarkyLinky 共有登録 PWA

Android の共有シートから MarkyLinky に URL を登録するための PWA（Web Share Target API）。

## コマンド

### ローカル起動

```bash
$ npm run dev
```

### ビルド

```bash
$ npm run build
```

## 使い方

1. Android の Chrome でデプロイ先URLを開き、「アプリをインストール」でホーム画面に追加する
2. 設定画面（`/`）で、拡張機能の options 画面で発行した API キーを貼り付けて保存する
3. 他のアプリで共有したいページを開き、共有メニューから「MarkyLinky」を選択すると `/share.html` が起動しURLが登録される

## デプロイ（Cloudflare Pages）

- Root directory: `share-pwa`
- Build command: `npm run build`
- Build output directory: `dist`
- 環境変数 `VITE_CREATE_ITEM_ENDPOINT` を Pages プロジェクトに設定

Wrangler CLI から手動デプロイする場合:

```bash
$ npm run build
$ npx wrangler pages deploy dist --project-name=********
```
