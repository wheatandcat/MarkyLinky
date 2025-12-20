import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

type Props = {
  onAdd: (name: string) => Promise<boolean>;
};

function Add(props: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const ok = await props.onAdd(name);
    setLoading(false);
    if (ok) {
      setOpen(false);
      setName("");
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 relative flex justify-center items-center text-white font-bold py-2 px-4 rounded-full"
        type="button"
      >
        + API Keyを作成
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-key w-5 h-5"
                      aria-label="API Key"
                    >
                      <title>API Key</title>
                      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path>
                      <path d="m21 2-9.6 9.6"></path>
                      <circle cx="7.5" cy="15.5" r="5.5"></circle>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-black"
                    >
                      新しいAPI Keyを作成
                    </DialogTitle>
                    <div className="mt-2">
                      <p className=" text-gray-500">
                        API
                        Keyを作成することで、外部からMarkyLinkyのデータを登録することができます
                      </p>
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="block w-full py-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="API Keyの名前を入力してください"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-3 mb-1 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  disabled={name === "" || loading}
                  onClick={handleAdd}
                  className="inline-flex w-full justify-center rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-900 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && (
                    <span className="h-4 w-4 mr-2 mt-0.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {loading ? "API Keyを作成中..." : "API Keyを作成"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-gray-500 inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Add;
