type Props = {
  onCopy: () => void;
};

function CopyButton(props: Props) {
  return (
    <button
      type="button"
      className="rounded-md inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 mr-2"
      onClick={() => props.onCopy()}
    >
      <span className="sr-only">Copy</span>
      <svg
        className="h-4 w-4 text-primary-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-label="Copy"
        role="img"
      >
        {" "}
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />{" "}
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}

export default CopyButton;
