chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save",
    title: "ページを追加/削除",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "add-link-item",
    title: "リンクを追加",
    contexts: ["selection"],
  });
});


export {};
