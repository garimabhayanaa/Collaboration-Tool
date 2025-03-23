// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_OSAJqNhQ-Ke90OQ30RGls0ZiswZy_WY",
  authDomain: "cocreate-ed5e1.firebaseapp.com",
  projectId: "cocreate-ed5e1",
  storageBucket: "cocreate-ed5e1.firebasestorage.app",
  messagingSenderId: "345112820325",
  appId: "1:345112820325:web:5031068a5dbe7d9e5be48c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();