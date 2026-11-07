// Firebase configuration and smart integration layer
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

// Read from env or localStorage
const getSavedFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem("agriconnect_firebase_config");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not read saved firebase config", e);
  }
  return null;
};

const savedConfig = getSavedFirebaseConfig();

export const firebaseConfig = {
  apiKey: savedConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: savedConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: savedConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: savedConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: savedConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: savedConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if valid Firebase configuration is active
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.apiKey.includes("YOUR_")
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully with project:", firebaseConfig.projectId);
  } catch (err) {
    console.warn("Firebase initialization error, fallback mode enabled:", err);
  }
} else {
  console.info("ℹ️ Running AgriConnect with reactive local Firestore & Auth persistence. You can connect your Firebase project anytime in the Firebase Settings panel.");
}

export { app, auth, db };

// Save custom firebase config helper
export const saveCustomFirebaseConfig = (config) => {
  localStorage.setItem("agriconnect_firebase_config", JSON.stringify(config));
  window.location.reload();
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem("agriconnect_firebase_config");
  window.location.reload();
};
