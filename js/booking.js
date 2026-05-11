import {
  auth,
  db
} from './firebase.js';

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ======================
// URL PARAMS
// ======================

const urlParams =
new URLSearchParams(window.location.search);

const movieId =
urlParams.get('id');

// ======================
// ELEMENTS
// ======================

const movieInfo =
document.getElementById('movieInfo');

const seatContainer =
document.getElementById('seatContainer');

const selectedSeatsText =
document.getElementById('selectedSeatsText');

const totalPriceText =
document.getElementById('totalPrice');

const confirmBookingBtn =
document.getElementById('confirmBookingBtn');

const bookingDate =
document.getElementById('bookingDate');

const bookingTime =
document.getElementById('bookingTime');

const qrCode =
document.getElementById('qrCode');

const upiText =
document.getElementById('upiText');

// ======================
// VARIABLES
// ======================

let movieData = null;

let selectedSeats = [];

let bookedSeats = [];

// ======================
// LOAD MOVIE
// ======================

async function loadMovie(){

  if(!movieId){

    movieInfo.innerHTML = `
      <h3 class="text-danger">
        Movie Not Found
      </h3>
    `;

    return;
  }

  const movieRef =
  doc(db, 'movies', movieId);

  const movieSnap =
  await getDoc(movieRef);

  if(!movieSnap.exists()){

    movieInfo.innerHTML = `
      <h3 class="text-danger">
        Invalid Movie
      </h3>
    `;

    return;
  }

  movieData =
  movieSnap.data();

  // MOVIE INFO

  movieInfo.innerHTML = `

    <div class="row">

      <div class="col-md-4">

        <img
          src="${movieData.posterUrl}"
          class="img-fluid rounded"
        >

      </div>

      <div class="col-md-8">

        <h2 class="neon-heading">
          ${movieData.movieName}
        </h2>

        <p>
          📍 ${movieData.place}
        </p>

        <p>
          🎬 ${movieData.theater}
        </p>

        <p>
          💰 ₹${movieData.ticketPrice}
        </p>

        <p>
          🕒 ${movieData.showTime}
        </p>

      </div>

    </div>

  `;

  // DATE + TIME

  bookingTime.value =
  movieData.showTime;

  bookingDate.min =
  movieData.startDate;

  // LOAD DATA

  await loadBookedSeats();

  generateSeats();

  loadUpi();

}

// ======================
// LOAD BOOKED SEATS
// ======================

async function loadBookedSeats(){

  bookedSeats = [];

  const querySnapshot =
  await getDocs(collection(db, 'bookings'));

  querySnapshot.forEach((docSnap) => {

    const booking =
    docSnap.data();

    if(
      booking.movieId === movieId
    ){

      booking.seats.forEach(seat => {

        bookedSeats.push(seat);

      });

    }

  });

}

// ======================
// GENERATE SEATS
// ======================

function generateSeats(){

  seatContainer.innerHTML = '';

  const rows =
  Number(movieData.rows);

  const cols =
  Number(movieData.cols);

  const walkwayAfter =
  Number(movieData.walkwayAfter);

  const walkwayType =
  movieData.walkwayType;

  for(let r = 0; r < rows; r++){

    const row =
    document.createElement('div');

    row.classList.add('seat-row');

    for(let c = 0; c < cols; c++){

      // VERTICAL WALKWAY

      if(
        walkwayType === 'vertical'
        &&
        c === walkwayAfter
      ){

        const walkway =
        document.createElement('div');

        walkway.classList.add('walkway');

        row.appendChild(walkway);

      }

      const seat =
      document.createElement('div');

      const seatId =
      `${String.fromCharCode(65+r)}${c+1}`;

      seat.classList.add('seat');

      // BOOKED

      if(
        bookedSeats.includes(seatId)
      ){

        seat.classList.add('booked');

      }

      else {

        seat.classList.add('available');

        seat.addEventListener(
          'click',
          () => toggleSeat(
            seat,
            seatId
          )
        );

      }

      seat.innerHTML =
      seatId;

      row.appendChild(seat);

    }

    seatContainer.appendChild(row);

    // HORIZONTAL WALKWAY

    if(
      walkwayType === 'horizontal'
      &&
      r === walkwayAfter-1
    ){

      const gap =
      document.createElement('div');

      gap.style.height =
      '25px';

      seatContainer.appendChild(gap);

    }

  }

}

// ======================
// TOGGLE SEAT
// ======================

function toggleSeat(
  seat,
  seatId
){

  if(
    selectedSeats.includes(seatId)
  ){

    selectedSeats =
    selectedSeats.filter(
      s => s !== seatId
    );

    seat.classList.remove(
      'selected'
    );

    seat.classList.add(
      'available'
    );

  }

  else {

    selectedSeats.push(
      seatId
    );

    seat.classList.remove(
      'available'
    );

    seat.classList.add(
      'selected'
    );

  }

  updateSummary();

}

// ======================
// UPDATE SUMMARY
// ======================

function updateSummary(){

  selectedSeatsText.innerHTML =

  selectedSeats.join(', ')
  || 'None';

  const total =

  selectedSeats.length
  *
  movieData.ticketPrice;

  totalPriceText.innerHTML =
  total;

  // UPDATE QR LIVE

  loadUpi();

}

// ======================
// LOAD UPI + QR
// ======================

async function loadUpi(){

  const upiRef =
  doc(db, 'settings', 'upi');

  const upiSnap =
  await getDoc(upiRef);

  if(!upiSnap.exists()){

    upiText.innerHTML =
    'UPI Not Configured';

    return;
  }

  const upi =
  upiSnap.data();

  const amount =

  selectedSeats.length
  *
  movieData.ticketPrice;

  upiText.innerHTML = `
    Pay Using:
    ${upi.upiId}
  `;

  // UPI LINK

  const upiLink =

  `upi://pay?pa=${upi.upiId}&pn=${upi.upiName}&am=${amount}&cu=INR`;

  // QR GENERATION

  qrCode.src =

  `https://quickchart.io/qr?text=${encodeURIComponent(upiLink)}&size=250`;

}

// ======================
// CONFIRM BOOKING
// ======================

confirmBookingBtn.addEventListener(
  'click',
  async () => {

    if(
      selectedSeats.length === 0
    ){

      alert('Select Seats');

      return;
    }

    if(
      bookingDate.value === ''
    ){

      alert('Select Booking Date');

      return;
    }

    confirmBookingBtn.disabled =
    true;

    confirmBookingBtn.innerHTML =
    'Booking Seats...';

    try {

      const user =
      auth.currentUser;

      await addDoc(
        collection(db, 'bookings'),
        {

          movieId,

          userId:user.uid,

          seats:selectedSeats,

          bookingDate:
          bookingDate.value,

          showTime:
          bookingTime.value,

          totalPrice:
          selectedSeats.length
          *
          movieData.ticketPrice,

          createdAt:
          new Date()

        }

      );

      alert(
        'Booking Successful'
      );

      window.location.reload();

    } catch(error){

      console.log(error);

      alert(error.message);

    }

  }
);

// ======================
// INIT
// ======================

loadMovie();