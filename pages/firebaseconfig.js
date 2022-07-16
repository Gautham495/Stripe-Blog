import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "__",
  authDomain: "__",
  projectId: "__",
  storageBucket: "__",
  messagingSenderId:"__",
  appId: "__",
  measurementId: "__",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

