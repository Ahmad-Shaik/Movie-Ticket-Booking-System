import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = { /* YOUR CONFIG HERE */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-btn').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).then((user) => {
        if(email === "admin@doll.com") window.location.href = "admin.html";
        else window.location.href = "booking.html";
    }).catch(err => alert(err.message));
};

document.getElementById('signup-btn').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => alert("Registered! Now Login."))
        .catch(err => alert(err.message));
};