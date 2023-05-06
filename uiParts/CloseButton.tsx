type Props = {
  onRemove: () => void
}

function CloseButton(props: Props) {
  return (
    <button
      type="button"
      className="rounded-md inline-flex items-center justify-center hover:bg-gray-200"
      onClick={() => props.onRemove()}>
      <span className="sr-only">Close menu</span>
      <svg
        className="h-4 w-4 text-red-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}

export default CloseButton
