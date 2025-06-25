import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Debug: Check if environment variables are being loaded
console.log('🔧 Firebase Environment Variables:');
console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? 'LOADED' : 'MISSING');
console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);

// Your Firebase config using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log('🔥 Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app; 