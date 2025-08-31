import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config injected directly (public keys only)
const firebaseConfig = {
  apiKey: "AIzaSyCqy4UaiPqlVcmJ4ghE47FIhjOoikbjEWI",
  authDomain: "finance-web-89bf4.firebaseapp.com",
  projectId: "finance-web-89bf4",
  storageBucket: "finance-web-89bf4.firebasestorage.app",
  messagingSenderId: "60362529098",
  appId: "1:60362529098:web:898fcbeaf8501cbf2e49b3"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
