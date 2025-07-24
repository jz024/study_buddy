import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(false);

  const db = getFirestore(getApp());

  const fetchSurveyData = async (uid) => {
    setSurveyLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.educationLevel && data.age && data.learningGoals) {
          setSurveyData({
            educationLevel: data.educationLevel,
            age: data.age,
            learningGoals: data.learningGoals
          });
        } else {
          setSurveyData(null);
        }
      } else {
        setSurveyData(null);
      }
    } catch (err) {
      setSurveyData(null);
    } finally {
      setSurveyLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setSurveyData(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const clearError = () => {
    setError(null);
  };

  // Fetch survey data when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchSurveyData(currentUser.uid);
    } else {
      setSurveyData(null);
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; 
  }, []);

  // Check if onboarding is needed
  const needsOnboarding = () => {
    return currentUser && !surveyLoading && !surveyData;
  };

  const value = {
    currentUser,
    signup,
    signin,
    logout,
    isAuthenticated,
    loading,
    error,
    clearError,
    surveyData,
    needsOnboarding,
    fetchSurveyData,
    surveyLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 