import { Storage } from "@plasmohq/storage";
import { type Data } from "../lib/storage";

const storage = new Storage();

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save",
    title: "ページを追加/削除",
    contexts: ["all"],
  });
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "Login") {
    await storage.set("login", true);
  } else if (message.type === "Logout") {
    await storage.set("login", false);
  }
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "save") {
    const activeTab = await storage.get<Data>("activeTab");
    if (!activeTab) return;

    const login = await storage.get<boolean>("login");

    const items = (await storage.get<Data[]>("saveItems")) ?? [];
    const isCurrentPageURL = items.some((v) => v.url === activeTab.url);
    if (isCurrentPageURL) {
      const newItems = items.filter((v) => v.url !== activeTab.url);
      await storage.set("saveItems", newItems);

      const syncDeleteItem = items.find((v) => v.url === activeTab.url);
      if (login) {
        if (syncDeleteItem) {
          const syncDeleteItems =
            (await storage.get<Data[]>("syncDeleteItems")) ?? [];
          syncDeleteItems.push(syncDeleteItem);
          await storage.set("syncDeleteItems", syncDeleteItems);
        }
      }
    } else {
      const item = {
        ...activeTab,
        created: new Date().toISOString(),
      };
      items.push(item);
      await storage.set("saveItems", items);

      if (login) {
        const syncAddItems = (await storage.get<Data[]>("syncAddItems")) ?? [];
        syncAddItems.push(item);
        await storage.set("syncAddItems", syncAddItems);
      }
    }

    try {
      await chrome.runtime.sendMessage({
        type: "UPDATE",
      });
    } catch (e) {
      // popupが開いていないときにエラーになるなので無視する
      console.log("error:", e);
    }
  }
});

function getActiveTabInfo() {
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const activeTab = tabs[0];
    console.log("Active Tab URL:", activeTab?.url);
    if (!activeTab) return;

    storage.set("activeTab", activeTab);
  });
}

// アクティブタブが変更されたときのイベントリスナー
chrome.tabs.onActivated.addListener((activeInfo) => {
  getActiveTabInfo();
});

// タブが更新されたときのイベントリスナー
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // タブが完全に読み込まれたときに情報を取得
  if (changeInfo.status === "complete") {
    getActiveTabInfo();
  }
});

// 初回起動時にもタブ情報を取得
getActiveTabInfo();

export {};
