import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWVO-KuRMTBGOvG4DW7bGbwvBTBoW-t44",
  authDomain: "doll-movies-9afd3.firebaseapp.com",
  databaseURL: "https://doll-movies-9afd3-default-rtdb.firebaseio.com",
  projectId: "doll-movies-9afd3",
  storageBucket: "doll-movies-9afd3.firebasestorage.app",
  messagingSenderId: "708115811523",
  appId: "1:708115811523:web:724a454d1972c36b8f2676",
  measurementId: "G-3YR015NWSF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById('seat-container');
const movieSelect = document.getElementById('movie');
const count = document.getElementById('count');
const total = document.getElementById('total');

// Create 48 seats with unique IDs
for (let i = 0; i < 48; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    seat.dataset.index = i; // Assign index for DB tracking
    container.appendChild(seat);
}

// --- REAL-TIME SYNC ---
// Listen to the 'bookings' document in Firestore
const movieDocRef = doc(db, "cinema", "screen_1");

onSnapshot(movieDocRef, (doc) => {
    const data = doc.data();
    if (data && data.occupiedSeats) {
        const allSeats = document.querySelectorAll('.seat');
        allSeats.forEach((seat, index) => {
            if (data.occupiedSeats.includes(index)) {
                seat.classList.add('occupied');
                seat.classList.remove('selected');
            }
        });
    }
});

// Selection Logic
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateCount();
    }
});

function updateCount() {
    const selectedSeats = document.querySelectorAll('.seat.selected').length;
    count.innerText = selectedSeats;
    total.innerText = selectedSeats * movieSelect.value;
}

// --- BOOKING LOGIC ---
document.getElementById('book-btn').addEventListener('click', async () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatIndices = Array.from(selectedSeats).map(seat => parseInt(seat.dataset.index));

    if (seatIndices.length === 0) return alert("Select a seat first!");

    try {
        await updateDoc(movieDocRef, {
            occupiedSeats: arrayUnion(...seatIndices)
        });
        alert("Booking Confirmed! Enjoy the show.");
        updateCount();
    } catch (error) {
        console.error("Error booking seats: ", error);
        alert("Booking failed. Check console.");
    }
});