// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyjxgZtCB8J_oCiIsppOPDYQwUuUIVecE",
  authDomain: "smartbudgetting.firebaseapp.com",
  projectId: "smartbudgetting",
  storageBucket: "smartbudgetting.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "137868999021",
  appId: "1:137868999021:web:9edb13557cd7e0de1ac264"
};

// Check if Firebase is not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Add auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('User is signed out');
  }
});

export { auth };