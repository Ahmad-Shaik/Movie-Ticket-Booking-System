import {
  auth,
  db
} from './firebase.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// REGISTER
const registerBtn = document.getElementById('registerBtn');

if(registerBtn){

  registerBtn.addEventListener('click', async () => {

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;

    try {

      const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
        address,
        role: 'user'
      });

      alert('Registration Successful');

      window.location = 'index.html';

    } catch(error){
      alert(error.message);
    }

  });

}

// LOGIN
const loginBtn = document.getElementById('loginBtn');

if(loginBtn){

  loginBtn.addEventListener('click', async () => {

    const email =
    document.getElementById('loginEmail').value;

    const password =
    document.getElementById('loginPassword').value;

    try {

      const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const userDoc =
      await getDoc(doc(db, 'users', user.uid));

      const userData = userDoc.data();

      if(userData.role === 'admin'){
        window.location = 'admin.html';
      } else {
        window.location = 'dashboard.html';
      }

    } catch(error){
      alert(error.message);
    }

  });

}

// SHOW PASSWORD
const togglePassword =
document.getElementById('togglePassword');

if(togglePassword){

  togglePassword.addEventListener('click', () => {

    const password =
    document.getElementById('password');

    if(password.type === 'password'){

      password.type = 'text';
      togglePassword.innerText = 'Hide';

    } else {

      password.type = 'password';
      togglePassword.innerText = 'Show';

    }

  });

}

// SHOW LOGIN PASSWORD
const toggleLoginPassword =
document.getElementById('toggleLoginPassword');

if(toggleLoginPassword){

  toggleLoginPassword.addEventListener('click', () => {

    const password =
    document.getElementById('loginPassword');

    if(password.type === 'password'){

      password.type = 'text';
      toggleLoginPassword.innerText = 'Hide';

    } else {

      password.type = 'password';
      toggleLoginPassword.innerText = 'Show';

    }

  });

}