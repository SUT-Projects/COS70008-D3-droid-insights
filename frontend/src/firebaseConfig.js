// frontend/src/firebaseConfig.js

// 1. Install the Firebase JS SDK if you haven't already:
//    npm install firebase

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 2. Replace the config object below with your Firebase project’s web-config.
//   You can find this in the Firebase console under Project Settings → General → “Your apps” → SDK setup.
const firebaseConfig = {
  apiKey: "AIzaSyCAHVeCIQ_fgG0g2Br6nhbSFRQxyKO872A",
  authDomain: "malware-detection-98b95.firebaseapp.com",
  projectId: "malware-detection-98b95",
  storageBucket: "malware-detection-98b95.firebasestorage.app",
  messagingSenderId: "352821027518",
  appId: "1:352821027518:web:64a52d1576f0957b6d74ef"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Export the Auth and Firestore instances for use throughout your app
export const auth = getAuth(app);
export const db   = getFirestore(app);
