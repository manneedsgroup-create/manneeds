import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut as fbSignOut,
  onAuthStateChanged,
  type ConfirmationResult,
  type User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || 'AIzaSyBIkujkbvIxoc6Yi6UH4-QClkynin3LV-w',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'manneeds-763c4.firebaseapp.com',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || 'manneeds-763c4',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'manneeds-763c4.firebasestorage.app',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '914911397328',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '1:914911397328:web:8f1e2265113c8964d6a5d5'
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

export {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  fbSignOut,
  onAuthStateChanged,
  type ConfirmationResult,
  type FirebaseUser
};
