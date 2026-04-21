import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Firebase: Initializing with config:", {
  hasApiKey: !!firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId,
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Messaging conditionally (not all browsers support it, especially old iOS)
export let messaging: Messaging | null = null;
try {
  messaging = getMessaging(app);
} catch (err) {
  console.warn("Firebase Messaging not supported on this device/browser", err);
}

export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Register service worker with config
      const configStr = encodeURIComponent(JSON.stringify(firebaseConfig));
      await navigator.serviceWorker.register(`/firebase-messaging-sw.js?config=${configStr}`);
      
      // CRUCIAL: Wait for the service worker to be fully installed and active!
      const registration = await navigator.serviceWorker.ready;
      
      const token = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      return token;
    }
  } catch (err) {
    console.error("Error requesting notification permission:", err);
    throw err;
  }
  return null;
}

console.log("Firebase: Services ready");


export async function logoutFirebase(): Promise<void> {
  return signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
