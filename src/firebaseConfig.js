import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByrMNnyQ6V0XF4xpMvz-By9igwcib6nBI",
  authDomain: "campusconnectapp-6bfaf.firebaseapp.com",
  projectId: "campusconnectapp-6bfaf",
  storageBucket: "campusconnectapp-6bfaf.firebasestorage.app",
  messagingSenderId: "13887494149",
  appId: "1:13887494149:web:1928c6adb63b21a5d9e46c",
  measurementId: "G-PBVF0ZDPZK"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };