import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';

// Segui il README nella sezione START WITH FIREBASE prima di continuare
// Sistema la tua public apiKey e authDomain qui sotto
const firebaseConfig = {
    apiKey: "AIzaSyCOjgmGVlPgtqsZnoVP5GlmzGotZQ-i2yY",
    authDomain: "cic-travel-app.firebaseapp.com",
};

if (firebaseConfig.apiKey === "") {
    console.log("Non hai settato il firebaseConfig in src/firebase.js");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Export the auth instance and functions
export { auth, provider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail };