function Card() {
  return (
    <div className="flex gap-2 items-center mx-2 my-6 border border-gray-300 rounded-lg p-2">
      <div className="px-2">
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
          className="lucide lucide-key w-5 h-5"
          aria-label="API Key"
        >
          <title>API Key</title>
          <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path>
          <path d="m21 2-9.6 9.6"></path>
          <circle cx="7.5" cy="15.5" r="5.5"></circle>
        </svg>
      </div>
      <div>
        <div className="text-base font-bold mb-1">title</div>
        <div className="flex gap-2">
          <div className="text-sm px-2 text-gray-500 bg-gray-100 rounded border border-gray-200 py-1">
            sk_live_************************7890
          </div>
          <button type="button">
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
              className="w-4 h-4 text-primary-600"
              aria-label="コピー"
            >
              <title>コピー</title>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex w-full justify-end px-2">
        <div className="flex gap-2">
          <div className="text-gray-500 text-xs">作成日: 2025-01-01 00:00</div>
          <button type="button">
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
              className="w-4 h-4 text-red-400"
              aria-label="削除"
            >
              <title>削除</title>
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
