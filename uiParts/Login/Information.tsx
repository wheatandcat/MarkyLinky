function Information() {
  return (
    <div>
      <div className="text-sm font-bold text-gray-600">Links</div>
      <div className="m-2">
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>
            <a
              href="https://chrome.google.com/webstore/detail/markylinky/kjjjfmbnaamaogjpjdgeiffgjabbpmfp?hl=ja"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Web Store
            </a>
          </li>
          <li>
            <a
              href="https://github.com/wheatandcat/MarkyLinky"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Information;
