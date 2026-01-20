import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRipmQR25gtToec59NBSejcPAc7l1o2fU",
  authDomain: "coifilmne-80a02.firebaseapp.com",
  projectId: "coifilmne-80a02",
  storageBucket: "coifilmne-80a02.firebasestorage.app",
  messagingSenderId: "729394484664",
  appId: "1:729394484664:web:80a5395558315f9e822b4d",
  measurementId: "G-KNQ1RYC7S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
