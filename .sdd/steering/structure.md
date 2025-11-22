# Project Structure

## ルートディレクトリ構成
```
/
├── popup.tsx            # ポップアップ UI エントリ
├── options.tsx          # オプション/ログイン・同期画面
├── content.ts           # コンテントスクリプト（プレースホルダ）
├── background/          # バックグラウンドサービスワーカー
├── core/                # Supabase クライアント初期化
├── lib/                 # DB アクセス・ストレージ型
├── uiParts/             # 再利用 UI コンポーネント
├── assets/              # ロゴ・アイコン等の静的リソース
├── style.css            # Tailwind ベースの共通スタイル
├── supabase/            # BaaS 定義（functions/migrations/seed）
├── doc/                 # スクリーンショット等の資料
└── build/               # ビルド成果物（自動生成）
```

## コード構成パターン
- 拡張の各エントリ（popup/options/background）から共通処理を `core`/`lib` に分離。
- Supabase との通信は `lib/database.ts` 経由で型付きアクセス。
- UI は `uiParts/` の小さな関数コンポーネント群を組み合わせて再利用。
- ローカル保存は Plasmo Storage（`saveItems` などのキー）を利用し、ログイン時に Supabase と双方向同期。

## ファイル命名規則
- コンポーネント/型は `PascalCase.tsx`（例：`AddButton.tsx`）
- ユーティリティ・ロジックは `camelCase.ts`（例：`database.ts`）
- ディレクトリは機能単位、静的リソースは `assets/` 配下に配置。

## 主要な設計原則
- UI は副作用を避け、データ取得/同期は専用モジュールに集約。
- ローカルストレージとクラウド同期を明確に分離し、ログイン状態でのみ Supabase に書き込み。
- 型安全（Supabase スキーマ）と簡易操作性（ワンクリック保存/削除・Markdown コピー）の両立。
