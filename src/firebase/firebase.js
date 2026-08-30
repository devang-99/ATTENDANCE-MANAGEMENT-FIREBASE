import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhYIf5HyOX9Q3XnrGcPlAPaIuxsAUYy0Y",
  authDomain: "chat-app-1ecef.firebaseapp.com",
  projectId: "chat-app-1ecef",
  storageBucket: "chat-app-1ecef.firebasestorage.app",
  messagingSenderId: "971953342001",
  appId: "1:971953342001:web:fc4f1319d5c94d24fef710",
  measurementId: "G-X1S2DD5CTJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider(); 
