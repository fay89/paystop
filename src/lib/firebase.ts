import { initializeApp } from 'firebase/app';
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
console.log("Firebase: Services ready");

export async function sendMagicLink(email: string): Promise<void> {
  const actionCodeSettings = {
    // Redirect back to the current origin
    url: window.location.origin,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // Store email locally to avoid asking for it again on the same device
  window.localStorage.setItem('emailForSignIn', email);
}

export async function finishMagicLinkLogin(url: string = window.location.href): Promise<User | null> {
  if (isSignInWithEmailLink(auth, url)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. Prompt for email.
      // Easiest is to reject or ask in UI, but since this is auth layer:
      email = window.prompt('Por seguridad, por favor confirma tu email para iniciar sesión');
    }
    if (!email) return null;
    
    // Complete the sign-in process
    const result = await signInWithEmailLink(auth, email, url);
    window.localStorage.removeItem('emailForSignIn');
    
    // Clean up the URL so the token isn't visible/reused if refreshed
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return result.user;
  }
  return null;
}

export async function logoutFirebase(): Promise<void> {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
