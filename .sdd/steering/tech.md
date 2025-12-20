# Technology Stack

## アーキテクチャ
Plasmo ベースの Chrome MV3 拡張。ポップアップ（`popup.tsx`）、オプションページ（`options.tsx`）、バックグラウンド（`background/index.ts`）で構成し、Plasmo Storage にローカル保存。Supabase を BaaS として用い、`items` テーブルにユーザー別ブックマークを同期。

## 使用技術
### 言語とフレームワーク
- TypeScript 5 / React 18：拡張 UI（ポップアップ・オプション）
- Plasmo：拡張エントリ管理・ビルド
- Supabase JS 2：認証/OAuth、データ永続化
- Tailwind CSS 3：スタイルユーティリティ

### 依存関係
- `@plasmohq/storage`：ローカル/同期ストレージ管理
- `@plasmohq/messaging`：メッセージング（必要に応じて）
- `react-toggle-dark-mode`：ダークモードトグル UI
- Supabase 型定義（`schema.ts`）による型安全な DB アクセス

## 開発環境
### 必要なツール
- Node.js / Yarn
- Plasmo CLI（`plasmo` npm 経由）

### よく使うコマンド
- 起動：`yarn dev`
- ビルド：`yarn build`
- パッケージ化：`yarn package`
- フォーマット：`yarn format`

## 環境変数
- `PLASMO_PUBLIC_SUPABASE_URL`：Supabase プロジェクト URL
- `PLASMO_PUBLIC_SUPABASE_KEY`：公開 API キー（anon）
