// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBu1-2ZsSgnJige3dLd4Yj7Y_LqglI_5NU",
  authDomain: "humour-match.firebaseapp.com",
  projectId: "humour-match",
  storageBucket: "humour-match.firebasestorage.app",
  messagingSenderId: "24946443253",
  appId: "1:24946443253:web:867cb9e317b3966f3616bc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);