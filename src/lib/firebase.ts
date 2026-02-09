import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD8zTExeOruiSorHh4jUrcdomn7S2ucBrE",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "yaerib-e835e.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yaerib-e835e",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "yaerib-e835e.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "857467373921",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:857467373921:web:2206b5a7c5a4d134e5dd20",
    measurementId: "G-TEY7VY0822"
};

// Initialize Firebase (client-side)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export default app;
