import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyBWVO-KuRMTBGOvG4DW7bGbwvBTBoW-t44",
    authDomain: "doll-movies-9afd3.firebaseapp.com",
    databaseURL: "https://doll-movies-9afd3-default-rtdb.firebaseio.com",
    projectId: "doll-movies-9afd3",
    storageBucket: "doll-movies-9afd3.firebasestorage.app",
    messagingSenderId: "708115811523",
    appId: "1:708115811523:web:724a454d1972c36b8f2676",
    measurementId: "G-3YR015NWSF"
}; /* PASTE YOUR CONFIG HERE */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const movieSelect = document.getElementById('movie-select');
const container = document.getElementById('seat-container');
const count = document.getElementById('count');
const total = document.getElementById('total');

// Create 48 seats
for (let i = 0; i < 48; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    seat.dataset.index = i;
    container.appendChild(seat);
}

// 1. Fetch Movies from Firestore
onSnapshot(collection(db, "movies"), (snapshot) => {
    movieSelect.innerHTML = '<option value="0">Choose a movie...</option>';
    snapshot.forEach(movieDoc => {
        const movie = movieDoc.data();
        const option = document.createElement('option');
        option.value = movie.price;
        option.dataset.id = movieDoc.id; // Store ID to link seat map
        option.textContent = `${movie.name} ($${movie.price})`;
        movieSelect.appendChild(option);
    });
});

// 2. Real-time Seat Sync for Selected Movie
movieSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const movieId = selectedOption.dataset.id;

    if (!movieId) return;

    onSnapshot(doc(db, "cinema", movieId), (docSnap) => {
        const occupied = docSnap.data()?.occupiedSeats || [];
        document.querySelectorAll('.seat').forEach((seat, i) => {
            seat.classList.toggle('occupied', occupied.includes(i));
            seat.classList.remove('selected');
        });
        updateCount();
    });
});

// 3. Booking Confirmation
document.getElementById('book-btn').onclick = async () => {
    const selectedOption = movieSelect.options[movieSelect.selectedIndex];
    const movieId = selectedOption.dataset.id;
    const selectedSeats = [...document.querySelectorAll('.seat.selected')].map(s => parseInt(s.dataset.index));

    if (!movieId || selectedSeats.length === 0) return alert("Select movie and seats!");

    await updateDoc(doc(db, "cinema", movieId), {
        occupiedSeats: arrayUnion(...selectedSeats)
    });
    alert("Booking Success!");
};

function updateCount() {
    const selected = document.querySelectorAll('.seat.selected').length;
    count.innerText = selected;
    total.innerText = selected * movieSelect.value;
}

container.onclick = (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateCount();
    }
};