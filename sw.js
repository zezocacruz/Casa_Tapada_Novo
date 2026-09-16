// Service worker mínimo: mostra notificações locais (registration.showNotification)
// e recebe notificações push reais enviadas pelo GitHub Action agendado.
// Não faz cache nem funciona offline.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// notificação push real, enviada pelo servidor (GitHub Action) quando há
// rotinas por fazer a uma das horas configuradas
self.addEventListener("push", (event) => {
  let data = { title: "tlm", body: "Tens rotinas por fazer." };
  if (event.data) {
    try { data = event.data.json(); } catch (e) {
      data = { title: "tlm", body: event.data.text() };
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "tlm", {
      body: data.body || "",
      tag: "tlm-routines",
      renotify: true,
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png"
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow("./");
    })
  );
});
