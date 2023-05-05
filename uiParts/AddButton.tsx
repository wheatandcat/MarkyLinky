type Props = {
  onSave: () => void
}

function AddButton(props: Props) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
      onClick={() => props.onSave()}>
      保存
    </button>
  )
}

export default AddButton
