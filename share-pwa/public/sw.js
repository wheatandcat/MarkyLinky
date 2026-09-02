self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // installability要件を満たすためのパススルーハンドラ（キャッシュ戦略は持たない）
});
