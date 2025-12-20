import Card from "~uiParts/ApiKey/Crad";

function List() {
  const apiKey = [
    {
      title: "API Key 1",
      token: "1234567890",
      created: new Date().toISOString(),
    },
    {
      title: "API Key 2",
      token: "1234567890",
      created: new Date().toISOString(),
    },
    {
      title: "API Key 3",
      token: "1234567890",
      created: new Date().toISOString(),
    },
  ];

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
        <button
          className="bg-blue-500 hover:bg-blue-700 relative flex justify-center items-center text-white font-bold py-2 px-4 rounded-full"
          onClick={() => {}}
          type="button"
        >
          + API Keyを作成
        </button>

        <Card />
      </div>
    </div>
  );
}

export default List;
