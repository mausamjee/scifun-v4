import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // PASTE YOUR KEYS HERE
  apiKey: "AIzaSyCWYcEZrwpqf_6V12Z8EplbwX41zBUkKM8",
  authDomain: "scifun-d4401.firebaseapp.com",
  projectId: "scifun-d4401",
  storageBucket: "scifun-d4401.firebasestorage.app",
  messagingSenderId: "798420548547",
  appId: "1:798420548547:web:87ec0c4429d80d8b2d5b76",
  measurementId: "G-LL52CXSN8F"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, googleProvider, db };