import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GITHUB_KEY,
  authDomain: "nwitter-reloaded-8ce0e.firebaseapp.com",
  projectId: "nwitter-reloaded-8ce0e",
  storageBucket: "nwitter-reloaded-8ce0e.appspot.com",
  messagingSenderId: "505165719491",
  appId: "1:505165719491:web:d79fee9102187339aebf76"
};

const app = initializeApp(firebaseConfig);

// user 로그인 정보 (firebase authentication)
export const auth = getAuth(app);

// 이미지 첨부 저장소 (firebase storage)
export const storage = getStorage(app);

// 게시글 정보 저장소 (firebase database)
export const db = getFirestore(app);