function Information() {
  return (
    <div>
      <br />
      <div className="text-sm font-bold text-gray-600">Hints</div>
      <div className="m-2">
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>ログインすると別ブラウザでもデータ同期ができます</li>
          <li>
            うまくデータ同期ができない時は上記のデータ同期ボタンをご利用ください
            🙇
          </li>
        </ul>
      </div>
      <br />
    </div>
  );
}

export default Information;
