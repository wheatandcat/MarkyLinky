import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";
import type { User } from "@supabase/supabase-js";
import titleImage from "data-base64:~assets/title.png";
import webImage from "data-base64:~assets/web.png";
import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import { supabase } from "~core/supabase";
import {
  deleteItem,
  deleteItems,
  getAllItems,
  insertItem,
  insertItems,
} from "~lib/database";

import type { Data } from "./lib/storage";
import AddButton from "./uiParts/AddButton";
import CloseButton from "./uiParts/CloseButton";
import CopyButton from "./uiParts/CopyButton";
import Search from "./uiParts/Search";
import SettingIcon from "./uiParts/SettingIcon";

import "./style.css";

const storage = new Storage();

localStorage.theme = "dark";

function IndexPopup() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local",
    }),
  });

  const [currentPage, setCurrentPage] = useState<Data>({
    title: "",
    url: "",
    favIconUrl: "",
    created: new Date().toISOString(),
  });
  const [removeButton, setRemoveButton] = useState(false);
  const [items, setItems] = useStorage<Data[]>("saveItems", []);
  const [render, setRender] = useState(0);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useStorage<"light" | "dark">("theme", "light");

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }
      if (data.session) {
        setUser(data.session.user);
        chrome.runtime.sendMessage({
          type: "Login",
        });
        storage.get<Data[]>("syncAddItems").then(async (syncAddItems) => {
          if (syncAddItems.length > 0) {
            await insertItems(
              syncAddItems.map((v) => ({
                uuid: data.session.user.id,
                title: v.title,
                url: v.url,
                favIconUrl: v.favIconUrl,
                created: v.created,
              }))
            );
            storage.remove("syncAddItems");
          }
        });
        storage.get<Data[]>("syncDeleteItems").then(async (syncDeleteItems) => {
          if (syncDeleteItems.length > 0) {
            await deleteItems(
              data.session.user.id,
              syncDeleteItems.map((v) => v.url)
            );
            storage.remove("syncDeleteItems");
          }
        });
        const { data: items, error } = await getAllItems(data.session.user.id);
        if (error) {
          alert("データの同期に失敗しました");
        }
        if (items) {
          setItems(items);
        }
      }
    }

    init();
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;

      setCurrentPage({
        title: activeTab.title,
        url: activeTab.url,
        favIconUrl: activeTab.favIconUrl,
        created: new Date().toISOString(),
      });

      const isCurrentPageURL = items.some((v) => v.url === activeTab.url);
      if (isCurrentPageURL) {
        setRemoveButton(true);
      } else {
        setRemoveButton(false);
      }
    });
    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === "UPDATE") {
        setRender(render + 1);
      }
    });
  }, [items, removeButton, render]);

  const onSave = async () => {
    await setItems((prev) => [...prev, currentPage]);

    if (user) {
      insertItem({
        uuid: user?.id ?? "",
        title: currentPage.title,
        url: currentPage.url,
        favIconUrl: currentPage.favIconUrl,
        created: currentPage.created,
      });
    }

    setRemoveButton(true);
  };

  const onRemove = async (index: number) => {
    const item = items[index];
    if (item) {
      if (currentPage.url === item.url) {
        setRemoveButton(false);
      }
    }

    await setItems((prev) => {
      prev.splice(index, 1);
      return prev;
    });

    if (user) {
      deleteItem(user.id, item.url);
    }

    setRender(render + 1);
  };

  const onCopy = async (index: number) => {
    const item = items[index];
    if (item) {
      const markdown = `[${item.title}](${item.url})`;
      navigator.clipboard.writeText(markdown);
    }
  };

  const onRemoveURL = async () => {
    const index = items.findIndex((v) => v.url === currentPage.url);
    if (index === -1) return;
    onRemove(index);
    setRemoveButton(false);
  };

  const filteredItems = items.filter((v) => {
    if (search === "") return true;
    return v.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  });

  return (
    <div className={mode}>
      <div
        className="pb-3 dark:bg-gray-800"
        style={{
          width: "400px",
        }}
      >
        <div className="flex px-4 items-center justify-between py-2">
          <img src={titleImage} alt="title logo" width={100} />
          <div className="flex items-center">
            <div className="px-2">
              <DarkModeSwitch
                checked={mode === "dark"}
                moonColor="#e6b422"
                sunColor="#f8b862"
                onChange={(dark) => setMode(dark ? "dark" : "light")}
                size={20}
              />
            </div>
            <button
              onClick={() => chrome.runtime.openOptionsPage()}
              type="button"
            >
              <SettingIcon
                color={mode === "dark" ? " text-white" : "text-gray-500"}
              />
            </button>
          </div>
        </div>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex items-center pl-4 pr-1 pt-3 pb-3">
          <Search onChangeText={(text) => setSearch(text)} />
          <div className="w-1/4 pl-4">
            {!removeButton ? (
              <AddButton onSave={onSave} />
            ) : (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
                onClick={() => onRemoveURL()}
                type="button"
              >
                削除
              </button>
            )}
          </div>
        </div>
        <div className="text-xs">
          {filteredItems.map((v, index) => (
            <div key={String(index)}>
              <div className="flex items-center h-6 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 pr-16">
                <div className="flex w-full mr-14 hover:bg-gray-100 dark:hover:bg-gray-600 h-6 items-center pl-4">
                  {v.favIconUrl ? (
                    <img
                      src={v.favIconUrl}
                      className="w-4 h-4 mr-1"
                      alt="favIcon"
                    />
                  ) : (
                    <img
                      src={webImage}
                      className="w-4 h-4 mr-1"
                      alt="favIcon"
                      style={mode === "dark" ? { filter: "invert(1)" } : null}
                    />
                  )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;
