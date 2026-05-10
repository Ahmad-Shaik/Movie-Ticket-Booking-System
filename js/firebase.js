import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5OfvWEDQX26FQtFNN-363ci1r6wEcIlA",
  authDomain: "dolly-movies.firebaseapp.com",
  projectId: "dolly-movies",
  storageBucket: "dolly-movies.firebasestorage.app",
  messagingSenderId: "252494791922",
  appId: "1:252494791922:web:03ef45b35636c397ddfc6b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);