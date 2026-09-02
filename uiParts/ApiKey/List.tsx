import { useState } from "react";
import type { ApiToken } from "~lib/storage";
import Add from "~uiParts/ApiKey/Add";
import Card from "~uiParts/ApiKey/Crad";

type Props = {
  apiTokens: ApiToken[];
  onAddApiKey: (title: string) => Promise<boolean>;
  onDeleteApiKey: (id: number) => Promise<boolean>;
};

const curlText = `curl --location 'https://axctfbvzkacuxfhfsjic.supabase.co/functions/v1/create-item?url=https%3A%2F%2Fgithub.com%2Fwheatandcat%2FMarkyLinky&token=***********************************'`;

function List(props: Props) {
  const [fade, setFade] = useState(false);

  const onCopy = () => {
    setFade(true);
    navigator.clipboard.writeText(curlText);

    setTimeout(() => {
      setFade(false);
    }, 1000);
  };

  return (
    <div>
      <div className="pb-4 max-w-2xl">
        <div className="text-sm font-bold text-gray-600">API Keys</div>
        <div className="m-2">
          <ul className="text-gray-500 list-disc list-inside dark:text-gray-400">
            <li>
              API
              Keyを生成することで、外部からMarkyLinkyのデータを登録することができます
            </li>
          </ul>
          <br />
          <Add onAdd={props.onAddApiKey} />

          {props.apiTokens.length === 0 && (
            <div className="text-base font-bold text-gray-500 px-1 mt-2">
              API Keyがありません
            </div>
          )}
          {props.apiTokens.map((apiToken) => (
            <Card
              key={apiToken.id}
              {...apiToken}
              onDelete={props.onDeleteApiKey}
            />
          ))}
        </div>
      </div>
      <div className="bg-green-50 items-center mx-2 mb-6 border border-gray-300 rounded-lg p-2 relative">
        <div
          className={`transition-all duration-200	 ${
            fade ? "opacity-100" : "opacity-0"
          } absolute right-2 top-12`}
        >
          <div className="bg-white rounded border border-gray-300 p-2">
            <div className="text-green-500 font-bold text-sm">
              コピーしました
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-white text-primary rounded-xl shadow-sm border border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-600 w-5 h-5"
              data-replit-metadata="client/src/pages/Dashboard.tsx:76:16"
              data-component-name="Terminal"
              aria-label="Terminal icon"
            >
              <title>Terminal icon</title>
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" x2="20" y1="19" y2="19"></line>
            </svg>
          </div>

          <div className="text-sm font-bold text-gray-600">API Keyの使い方</div>
        </div>
        <br />
        <div className="text-sm font-bold text-gray-600 px-1">
          ■ アイテム作成 API
          <span className="text-gray-500 text-xs">
            （GETパラメータの「token」に作成したAPI Keyを指定してください）
          </span>
        </div>
        <button
          type="button"
          className="text-sm text-gray-500 px-1 mt-2 cursor-pointer w-full text-left"
          onClick={onCopy}
        >
          <pre className="text-gray-500 bg-gray-100 border-gray-200 hover:bg-gray-200 border rounded-md p-2 whitespace-pre-wrap">
            {curlText}
          </pre>
        </button>

        <div className="text-sm px-1 pt-4">
          <span className="text-gray-600 font-bold">■ iOSで使う場合</span>
          <div className="text-sm text-gray-500 bg-gray-100 border-gray-200 px-2 py-2 mt-2 cursor-pointer w-full text-left border rounded-md p-2 whitespace-pre-wrap">
            以下の記事を参考にiOSのショートカットを作成してください。
            <br />-{" "}
            <a
              href="https://www.wheatandcat.me/entry/2025/12/27/103841"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-bold"
            >
              APIキーを使用してiOSのショートカット経由からwebページを登録できるようにする
            </a>
          </div>
        </div>

        <div className="text-sm font-bold text-gray-600 px-1 pt-4 pb-2">
          ■ Androidで使う場合
          <div className="text-sm text-gray-500 bg-gray-100 border-gray-200 px-2 py-2 mt-2 cursor-pointer w-full text-left border rounded-md p-2 whitespace-pre-wrap">
            以下の記事を参考にPWAを経由して利用してください
            <br />-{" "}
            <a
              href="https://www.wheatandcat.me/entry/2025/12/27/103841"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-bold"
            >
              APIキーを使用してiOSのショートカット経由からwebページを登録できるようにする
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
