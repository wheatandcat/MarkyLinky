import Card from "~uiParts/ApiKey/Crad";
import Add from "~uiParts/ApiKey/Add";
import type { ApiToken } from "~lib/storage";

type Props = {
  apiTokens: ApiToken[];
  onAddApiKey: (title: string) => Promise<boolean>;
  onDeleteApiKey: (id: number) => Promise<boolean>;
};

function List(props: Props) {
  return (
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
        {props.apiTokens.map((apiToken) => (
          <Card
            key={apiToken.id}
            {...apiToken}
            onDelete={props.onDeleteApiKey}
          />
        ))}
      </div>
    </div>
  );
}

export default List;
