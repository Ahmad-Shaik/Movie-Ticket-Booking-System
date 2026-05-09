import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { /* YOUR CONFIG HERE */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('add-movie').onclick = async () => {
    const name = document.getElementById('movie-name').value;
    const price = document.getElementById('movie-price').value;
    
    await addDoc(collection(db, "movies"), { name, price: parseInt(price) });
    alert("Movie Added!");
};
