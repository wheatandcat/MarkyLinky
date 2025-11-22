# Repository Guidelines

## プロジェクト構成と役割
- `content.ts` はコンテントスクリプト、`popup.tsx` と `options.tsx` は拡張機能の UI エントリ、共通の UI は `uiParts/` 配下。
- `core/` は Supabase クライアント初期化、`lib/database.ts`・`lib/storage.ts` がデータ永続化周りのヘルパー。
- `supabase/` にバックエンド定義（関数・マイグレーション・シード）。変更時は README か PR に手順を併記。
- 静的リソースは `assets/`、ドキュメントやスクリーンショットは `doc/`、ビルド成果物は `build/`（自動生成なので通常は手動編集しない）。

## 開発・ビルド・検証コマンド
- `yarn dev`：Plasmo の開発サーバー。Chrome 拡張をデベロッパーモードで読み込み動作確認。
- `yarn build`：本番向けビルド。`build/chrome-mv3-prod` に出力。
- `yarn package`：配布用 ZIP を生成（`build/chrome-mv3-prod.zip`）。
- `yarn format`：Biome でフォーマットと推奨リンティングを実行。

## コーディングスタイル
- TypeScript + React（関数コンポーネント）を基本。インデントはスペース 2、ダブルクオート準拠（Biome 設定）。
- 変数・関数は `camelCase`、コンポーネントと型は `PascalCase`。ファイルは機能単位でまとめ、 UI は `uiParts/` を優先。
- import は Biome に任せて整理。ロジックは lib/core に寄せ、 UI では副作用を避ける。

## テスト方針
- 自動テストは未整備。PR では少なくとも `yarn dev` で手動確認（保存/削除/Markdown 出力、ライト/ダーク切替）を行い、確認環境を記載。
- Supabase 連携を変更する場合は、必要なマイグレーションやシードの適用手順を PR 説明に含める。

## コミットと PR
- コミットは短い英語現在形で要点のみ（例: `fix popup toggle`, `add supabase init`）。細分化してレビューしやすく。
- PR には概要、動機、主要変更点、確認手順を簡潔に記載。UI 変更は before/after スクリーンショットを添付。
- 関連 Issue があればリンクし、設定ファイルや鍵類の差分がないか再確認してから提出。

## セキュリティ・設定の注意
- 環境依存キーや Supabase の秘密情報はコミットしない。`key.json` などのローカル専用ファイルは扱いに注意し、共有が必要ならサンプル化。
- ブラウザ拡張の権限追加時は最小権限に留め、manifest の変更理由を PR で説明する。ログには機密 URL やトークンを残さない。
