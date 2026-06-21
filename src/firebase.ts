import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  limit,
  writeBatch
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7KYv31FL2l8BDyvX0A4lknGPI52_Gz2U",
  authDomain: "probable-studio-jdzmz.firebaseapp.com",
  projectId: "probable-studio-jdzmz",
  storageBucket: "probable-studio-jdzmz.firebasestorage.app",
  messagingSenderId: "1098067267244",
  appId: "1:1098067267244:web:b95368e35652b34a535909",
  firestoreDatabaseId: "ai-studio-1d122c67-138b-4076-bb73-598004aa0c1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore utilizing our specific multi-database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Generic functions to check connection
export { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit,
  writeBatch
};
export type { FirebaseUser };
