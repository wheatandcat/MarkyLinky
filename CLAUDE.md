# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

MarkyLinky は URL を保存/削除して Markdown を出力できる Chrome 拡張（Manifest V3）。Plasmo フレームワーク + TypeScript + React + Tailwind CSS で構築され、バックエンドに Supabase（認証・DB・Edge Functions）を使用。

より詳細なリポジトリガイドラインは `AGENTS.md` を参照。

## コマンド

```bash
yarn dev        # Plasmo 開発サーバー（Chrome にデベロッパーモードで build/chrome-mv3-dev を読み込んで動作確認）
yarn build      # 本番ビルド（build/chrome-mv3-prod に出力）
yarn package    # 配布用 ZIP 生成
yarn format     # Biome でフォーマット + リント（スペース2、ダブルクオート）
```

### Supabase

```bash
supabase migration new xxxxxx                          # マイグレーションファイル作成
supabase migration up                                  # ローカル環境でマイグレーション
supabase gen types typescript --local > schema.ts      # DB 型を schema.ts に自動生成
supabase db push                                       # 本番にマイグレーション反映
supabase functions serve --no-verify-jwt               # ローカルで Edge Functions 起動
supabase functions deploy <name>                       # Edge Functions を本番デプロイ
```

自動テストは未整備。変更後は `yarn dev` で手動確認（保存/削除/Markdown 出力、ライト/ダーク切替）する。

## アーキテクチャ

### 拡張機能のエントリポイント（Plasmo の規約でルート直下に配置）

- `popup.tsx` — メイン UI。保存済み URL の一覧・検索・追加/削除・Markdown コピー
- `options.tsx` — 設定ページ。ログイン（Supabase Auth）と API キー管理
- `background/index.ts` — Service Worker。コンテキストメニュー登録、アクティブタブ情報の追跡、ログイン状態の保持
- `content.ts` — コンテントスクリプト
- 共通 UI コンポーネントは `uiParts/` 配下（機能単位のサブディレクトリあり: `Login/`, `ApiKey/`, `Icon/`）

### データフロー（ローカル優先 + Supabase 同期）

保存データは常に `@plasmohq/storage` のローカルストレージ（キー `saveItems`）に保持され、ログイン時のみ Supabase の `items` テーブルに同期される。

- popup が開いているとき: `popup.tsx` が直接 `lib/database.ts` 経由で Supabase に insert/delete
- popup が閉じているとき（コンテキストメニュー操作）: `background/index.ts` が `syncAddItems` / `syncDeleteItems` キューに積み、次回 popup 起動時に `popup.tsx` の init でまとめて Supabase に反映してキューをクリア
- background ⇔ popup 間の更新通知は `chrome.runtime.sendMessage`（`type: "UPDATE"` / `"Login"` / `"Logout"`）

### Supabase 連携

- `core/supabase.ts` — クライアント初期化。環境変数 `PLASMO_PUBLIC_SUPABASE_URL` / `PLASMO_PUBLIC_SUPABASE_KEY` を使用（`.env` に定義、コミット禁止）
- `schema.ts` — `supabase gen types` による自動生成ファイル。DB スキーマ変更後は再生成する（手動編集しない）
- `lib/database.ts` — `items` / `api_tokens` テーブルへの CRUD ヘルパー。行の識別はユーザーの `uuid` + `url`
- `supabase/migrations/` — SQL マイグレーション
- `supabase/functions/` — Deno 製 Edge Functions（`create-token`: API キー発行、`create-item`: API キー経由での URL 登録。SSRF 対策のホストブロックリストを含む）

### ビルド設定

- `package.json` の `manifest` キーで MV3 マニフェストを拡張（permissions, host_permissions 等）。`$CRX_KEY` / `$CRX_ID` は環境変数から注入
- `build/` は自動生成物なので手動編集しない

## 規約

- コミットメッセージは短い英語現在形（例: `fix popup toggle`）
- ロジックは `lib/` / `core/` に寄せ、UI コンポーネントでは副作用を避ける
- import 整理は Biome に任せる（organizeImports 有効）
- `key.json` や Supabase の秘密情報はコミットしない
