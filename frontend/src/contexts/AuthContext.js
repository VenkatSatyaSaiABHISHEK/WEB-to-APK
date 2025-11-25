import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, githubProvider, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out', user);
      
      if (user) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          const fullUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userData
          };
          
          console.log('Setting user data:', fullUserData);
          setUser(fullUserData);
        } catch (error) {
          console.error('Error getting user document:', error);
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          displayName: displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          appsGenerated: 0,
          totalDownloads: 0,
          planType: 'free',
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
  };

  // Email/Password Registration
  const register = async (email, password, displayName) => {
    try {
      setError('');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await createUserDocument(user, { displayName });
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    try {
      setError('');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setError('');
      const { user } = await signInWithPopup(auth, googleProvider);
      await createUserDocument(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // GitHub Sign In
  const signInWithGitHub = async () => {
    try {
      setError('');
      const { user } = await signInWithPopup(auth, githubProvider);
      await createUserDocument(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError('');
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updates, { merge: true });
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    resetPassword,
    updateUserProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};