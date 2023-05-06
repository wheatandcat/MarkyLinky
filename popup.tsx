import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"

import { type Data } from "./lib/storage"
import AddButton from "./uiParts/AddButton"
import CloseButton from "./uiParts/CloseButton"
import CopyButton from "./uiParts/CopyButton"
import Search from "./uiParts/Search"

import "./style.css"

function IndexPopup() {
  const [currentPage, setCurrentPage] = useState<Data>({
    title: "",
    url: "",
    favIconUrl: ""
  })
  const [removeButton, setRemoveButton] = useState(false)
  const [items, setItems] = useStorage<Data[]>("saveItems", [])
  const [render, setRender] = useState(0)
  const [search, setSearch] = useState("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab) return

      setCurrentPage({
        title: activeTab.title,
        url: activeTab.url,
        favIconUrl: activeTab.favIconUrl
      })

      const isCurrentPageURL = items.some((v) => v.url === activeTab.url)
      if (isCurrentPageURL) {
        setRemoveButton(true)
      } else {
        setRemoveButton(false)
      }
    })
    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === "UPDATE") {
        setRender(render + 1)
      }
    })
  }, [items, removeButton])

  const onSave = async () => {
    await setItems((prev) => [...prev, currentPage])

    setRemoveButton(true)
  }

  const onRemove = async (index: number) => {
    const item = items[index]
    if (item) {
      if (currentPage.url === item.url) {
        setRemoveButton(false)
      }
    }

    await setItems((prev) => {
      prev.splice(index, 1)
      return prev
    })

    setRender(render + 1)
  }

  const onCopy = async (index: number) => {
    const item = items[index]
    if (item) {
      const markdown = `[${item.title}](${item.url})`
      navigator.clipboard.writeText(markdown)
    }
  }

  const onRemoveURL = async () => {
    const index = items.findIndex((v) => v.url === currentPage.url)
    if (index === -1) return
    onRemove(index)
    setRemoveButton(false)
  }

  const filteredItems = items.filter((v) => {
    if (search === "") return true
    return v.title.includes(search)
  })

  return (
    <div
      className="py-2"
      style={{
        width: "400px"
      }}>
      <div className="flex items-center px-4">
        <Search onChangeText={(text) => setSearch(text)} />
        <div className="w-1/4 pl-4">
          {!removeButton ? (
            <AddButton onSave={onSave} />
          ) : (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
              onClick={() => onRemoveURL()}>
              削除
            </button>
          )}
        </div>
      </div>
      <br />

      <div className="text-xs">
        {filteredItems.map((v, index) => (
          <div
            key={String(index)}
            className=" flex items-center h-6 text-gray-600 hover:text-gray-900 pr-16">
            <div className="flex w-full mr-14 hover:bg-gray-100 h-6 items-center pl-4">
              <img
                src={v.favIconUrl}
                className="w-4 h-4 mr-1"
                alt="image favIcon"
              />
              <p className="truncate">
                <a href={v.url} target="_blank" rel="noreferrer">
                  {v.title}
                </a>
              </p>
            </div>
            <div className="absolute right-4">
              <CopyButton onCopy={() => onCopy(index)} />
              <CloseButton onRemove={() => onRemove(index)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndexPopup
