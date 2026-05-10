// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5OfvWEDQX26FQtFNN-363ci1r6wEcIlA",
  authDomain: "dolly-movies.firebaseapp.com",
  databaseURL: "https://dolly-movies-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dolly-movies",
  storageBucket: "dolly-movies.firebasestorage.app",
  messagingSenderId: "252494791922",
  appId: "1:252494791922:web:03ef45b35636c397ddfc6b",
  measurementId: "G-PXQBTP0MV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);