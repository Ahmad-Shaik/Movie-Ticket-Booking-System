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

      const userCredential = await createUserWithEmailAndPassword(
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
