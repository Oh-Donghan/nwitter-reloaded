import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GITHUB_KEY,
  authDomain: "nwitter-reloaded-8ce0e.firebaseapp.com",
  projectId: "nwitter-reloaded-8ce0e",
  storageBucket: "nwitter-reloaded-8ce0e.appspot.com",
  messagingSenderId: "505165719491",
  appId: "1:505165719491:web:d79fee9102187339aebf76"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);