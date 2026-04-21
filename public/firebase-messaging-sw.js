importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Parse config from URL parameter
const urlParams = new URLSearchParams(location.search);
const configStr = urlParams.get('config');

if (configStr) {
  const firebaseConfig = JSON.parse(decodeURIComponent(configStr));
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Background message handler
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'PayStop Alerta';
    const notificationOptions = {
      body: payload.notification?.body,
      icon: '/vite.svg', // Default vite icon used as placeholder
      data: payload.data
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Notification Click Handler to navigate to the specific subscription
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const subId = event.notification.data?.subscriptionId;
  const targetUrl = subId ? `/?subId=${subId}` : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab to the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
