import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { /* PASTE YOUR CONFIG HERE */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('add-movie').onclick = async () => {
    const name = document.getElementById('movie-name').value;
    const price = document.getElementById('movie-price').value;

    if (name && price) {
        try {
            // 1. Add movie to movies collection
            const movieRef = await addDoc(collection(db, "movies"), { 
                name: name, 
                price: parseInt(price) 
            });

            // 2. Create a specific seat-map document for this movie ID
            await setDoc(doc(db, "cinema", movieRef.id), {
                occupiedSeats: []
            });

            alert("Movie Published Successfully!");
            location.reload();
        } catch (e) { alert("Error: " + e.message); }
    }
};