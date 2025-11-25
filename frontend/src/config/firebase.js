// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdrRvxt8P10sT0ZteaziN5TCT-FuiNnKE",
  authDomain: "khub-bdabd.firebaseapp.com",
  projectId: "khub-bdabd",
  storageBucket: "khub-bdabd.firebasestorage.app",
  messagingSenderId: "401713212611",
  appId: "1:401713212611:web:d569d4a07fac761fb24676",
  measurementId: "G-LTK6TY8YX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Configure auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;