import { Storage } from "@plasmohq/storage";
import { type Data } from "./lib/storage";

const storage = new Storage();

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save",
    title: "ページを追加/削除",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "save") {
    const activeTab = await storage.get<Data>("activeTab");
    if (!activeTab) return;

    const items = (await storage.get<Data[]>("saveItems")) ?? [];
    const isCurrentPageURL = items.some((v) => v.url === activeTab.url);
    if (isCurrentPageURL) {
      const newItems = items.filter((v) => v.url !== activeTab.url);
      await storage.set("saveItems", newItems);
    } else {
      items.push(activeTab);
      await storage.set("saveItems", items);
    }
    chrome.runtime.sendMessage({
      type: "UPDATE",
    });
  }
});

function getActiveTabInfo() {
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const activeTab = tabs[0];
    console.log("Active Tab URL:", activeTab.url);
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
