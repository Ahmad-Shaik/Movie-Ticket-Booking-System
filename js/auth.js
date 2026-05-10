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

// ======================
// REGISTER
// ======================

const registerBtn =
document.getElementById('registerBtn');

if(registerBtn){

  registerBtn.addEventListener('click', async () => {

    const name =
    document.getElementById('name').value.trim();

    const email =
    document.getElementById('email').value.trim();

    const phone =
    document.getElementById('phone').value.trim();

    const address =
    document.getElementById('address').value.trim();

    const password =
    document.getElementById('password').value;

    if(
      !name ||
      !email ||
      !phone ||
      !address ||
      !password
    ){

      alert('Please Fill All Fields');

      return;
    }

    // BUTTON LOADING
    registerBtn.disabled = true;

    registerBtn.innerHTML = `
      <span
        class="spinner-border spinner-border-sm"
      ></span>
      Registering...
    `;

    try {

      // CREATE USER
      const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user =
      userCredential.user;

      // SAVE USER DATA
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          name,
          email,
          phone,
          address,
          role: 'user',
          createdAt: new Date()
        }
      );

      // SUCCESS
      registerBtn.innerHTML = `
        Registration Successful ✓
      `;

      setTimeout(() => {

        window.location.href =
        './index.html';

      }, 1200);

    } catch(error){

      console.log(error);

      alert(error.message);

      registerBtn.disabled = false;

      registerBtn.innerHTML = `
        Register
      `;

    }

  });

}

// ======================
// LOGIN
// ======================

const loginBtn =
document.getElementById('loginBtn');

if(loginBtn){

  loginBtn.addEventListener('click', async () => {

    const email =
    document.getElementById('loginEmail').value.trim();

    const password =
    document.getElementById('loginPassword').value;

    if(!email || !password){

      alert('Enter Email & Password');

      return;
    }

    // BUTTON LOADING
    loginBtn.disabled = true;

    loginBtn.innerHTML = `
      <span
        class="spinner-border spinner-border-sm"
      ></span>
      Logging in...
    `;

    try {

      // LOGIN
      const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user =
      userCredential.user;

      // GET USER DATA
      const userRef =
      doc(db, 'users', user.uid);

      const userSnap =
      await getDoc(userRef);

      // USER DOC MISSING
      if(!userSnap.exists()){

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: 'user',
          createdAt: new Date()
        });

      }

      const finalSnap =
      await getDoc(userRef);

      const userData =
      finalSnap.data();

      // SUCCESS
      loginBtn.innerHTML = `
        Login Successful ✓
      `;

      setTimeout(() => {

        if(userData.role === 'admin'){

          window.location.href =
          './admin.html';

        } else {

          window.location.href =
          './dashboard.html';

        }

      }, 1200);

    } catch(error){

      console.log(error);

      alert(error.message);

      loginBtn.disabled = false;

      loginBtn.innerHTML = `
        Login
      `;

    }

  });

}

// ======================
// SHOW/HIDE REGISTER PASSWORD
// ======================

const togglePassword =
document.getElementById('togglePassword');

if(togglePassword){

  togglePassword.addEventListener('click', () => {

    const password =
    document.getElementById('password');

    if(password.type === 'password'){

      password.type = 'text';

      togglePassword.innerText =
      'Hide';

    } else {

      password.type = 'password';

      togglePassword.innerText =
      'Show';

    }

  });

}

// ======================
// SHOW/HIDE LOGIN PASSWORD
// ======================

const toggleLoginPassword =
document.getElementById('toggleLoginPassword');

if(toggleLoginPassword){

  toggleLoginPassword.addEventListener('click', () => {

    const password =
    document.getElementById('loginPassword');

    if(password.type === 'password'){

      password.type = 'text';

      toggleLoginPassword.innerText =
      'Hide';

    } else {

      password.type = 'password';

      toggleLoginPassword.innerText =
      'Show';

    }

  });

}