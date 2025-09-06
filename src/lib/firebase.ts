
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "linkpocket-i61zx",
  appId: "1:981863481141:web:871e93c67d266954c4167c",
  storageBucket: "linkpocket-i61zx.firebasestorage.app",
  apiKey: "AIzaSyCSDWzcHXUQFEoU3JUZtTlzyU4fPUMpwp0",
  authDomain: "linkpocket-i61zx.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "981863481141"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
