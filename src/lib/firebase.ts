// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';

// Your web app's Firebase configuration
// IMPORTANT: For production, it's highly recommended to store these values in
// a .env.local file and access them via process.env.NEXT_PUBLIC_...
const firebaseConfig = {
  apiKey: "AIzaSyBoCm4Yz571mL6gKQqXbKoaEe0fprhrYSA",
  authDomain: "valutify.firebaseapp.com",
  projectId: "valutify",
  storageBucket: "valutify.firebasestorage.app",
  messagingSenderId: "860063548120",
  appId: "1:860063548120:web:656d6ee8772c3c2d7d4dad",
  measurementId: "G-68KNZTPGCM"
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

// Initialize Firebase only if it hasn't been initialized yet to prevent errors during
// development with Next.js's Hot Module Replacement (HMR).
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

db = getFirestore(app);
storage = getStorage(app);
auth = getAuth(app);

export { db, storage, auth };
export default app; 