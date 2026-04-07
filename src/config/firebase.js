import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID

  apiKey: "AIzaSyANrg63z5YczYKrBbfOpeECwHaSpMrnguc",
  authDomain: "eats-on-tap-17d90.firebaseapp.com",
  projectId: "eats-on-tap-17d90",
  storageBucket: "eats-on-tap-17d90.firebasestorage.app",
  messagingSenderId: "803376994544",
  appId: "1:803376994544:web:14239483d52e57a92a8a35"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();