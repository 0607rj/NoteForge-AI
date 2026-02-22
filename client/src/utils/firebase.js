
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-notes-825c5.firebaseapp.com",
  projectId: "ai-notes-825c5",
  storageBucket: "ai-notes-825c5.firebasestorage.app",
  messagingSenderId: "266673710198",
  appId: "1:266673710198:web:acdab5844d2c53135b6b57",
  measurementId: "G-NXGV6KNM4F"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}