import {
  db,
  auth
} from './firebase.js';

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ======================
// URL PARAMS
// ======================

const params =
new URLSearchParams(
  window.location.search
);

const movieId =
params.get('id');

// ======================
// ELEMENTS
// ======================

const movieDetails =
document.getElementById(
  'movieDetails'
);

const dateSelect =
document.getElementById(
  'dateSelect'
);

const showSelect =
document.getElementById(
  'showSelect'
);

const seatContainer =
document.getElementById(
  'seatContainer'
);

const paymentSection =
document.getElementById(
  'paymentSection'
);

const upiQr =
document.getElementById(
  'upiQr'
);

const totalAmountText =
document.getElementById(
  'totalAmountText'
);

const verifyPaymentBtn =
document.getElementById(
  'verifyPaymentBtn'
);

const seatTimer =
document.getElementById(
  'seatTimer'
);

const timerText =
document.getElementById(
  'timerText'
);

// ======================
// VARIABLES
// ======================

let movie;

let selectedSeats = [];

let bookedSeats = [];

let selectedDate = '';

let selectedShow = '';

let timerInterval;

let remainingSeconds = 300;

let paymentExpired = false;

// ======================
// LOAD MOVIE
// ======================

async function loadMovie(){

  try{

    const docRef =
    doc(db, 'movies', movieId);

    const docSnap =
    await getDoc(docRef);

    if(!docSnap.exists()){

      movieDetails.innerHTML = `
        <h2 class="text-danger text-center">
          Movie Not Found
        </h2>
      `;

      return;

    }

    movie = docSnap.data();

    bookedSeats =
    movie.bookedSeats || [];

    movieDetails.innerHTML = `

      <div class="row align-items-center">

        <div class="col-md-4 text-center mb-3">

          <img
            src="${movie.posterUrl}"
            class="img-fluid rounded"
            style="max-height:400px;"
          >

        </div>

        <div class="col-md-8">

          <h1 class="neon-heading">
            ${movie.movieName || 'Movie'}
          </h1>

          <p class="text-light fs-5">
            📍 ${movie.place || 'N/A'}
          </p>

          <p class="text-light fs-5">
            🎬 ${movie.theater || 'N/A'}
          </p>

          <p class="text-light fs-5">
            💰 ₹${movie.ticketPrice || 0}
          </p>

        </div>

      </div>

    `;

    generateDates();

    generateShows();

    renderSeats();

    enableLiveSeatUpdates();

  }

  catch(error){

    console.error(error);

    movieDetails.innerHTML = `
      <h2 class="text-danger text-center">
        Error Loading Booking Page
      </h2>
    `;

  }

}

// ======================
// DATES
// ======================

function generateDates(){

  dateSelect.innerHTML = '';

  const startDate =
  movie.showDate
  ? new Date(movie.showDate)
  : new Date();

  const totalDays =
  movie.runDays || 1;

  for(
    let i = 0;
    i < totalDays;
    i++
  ){

    const date =
    new Date(startDate);

    date.setDate(
      startDate.getDate() + i
    );

    const formatted =
    date.toISOString().split('T')[0];

    dateSelect.innerHTML += `
      <option value="${formatted}">
        ${formatted}
      </option>
    `;

  }

  selectedDate =
  dateSelect.value;

}

// ======================
// SHOWS
// ======================

function generateShows(){

  showSelect.innerHTML = '';

  // USE FIRESTORE SHOWS

  if(
    movie.shows &&
    movie.shows.length > 0
  ){

    movie.shows.forEach(show => {

      showSelect.innerHTML += `

        <option value="${show.showName}">

          ${show.showName}
          -
          ${show.startTime}

        </option>

      `;

    });

    selectedShow =
    showSelect.value;

    return;

  }

  // AUTO GENERATE SHOWS

  const firstShow =
  movie.firstShowTime || '07:00';

  const totalShows =
  movie.showsPerDay || 5;

  const movieDuration =
  movie.movieDuration || 150;

  const intervalTime =
  movie.intervalTime || 20;

  const cleaningTime =
  movie.cleaningTime || 20;

  let currentTime =
  convertToMinutes(firstShow);

  for(
    let i = 1;
    i <= totalShows;
    i++
  ){

    const formattedTime =
    convertTo12Hour(currentTime);

    const showName =
    `Show ${i}`;

    showSelect.innerHTML += `

      <option value="${showName}">

        ${showName}
        -
        ${formattedTime}

      </option>

    `;

    currentTime +=
    movieDuration +
    intervalTime +
    cleaningTime;

  }

  selectedShow =
  showSelect.value;

}

function convertToMinutes(time){

  const [hours, minutes] =
  time.split(':').map(Number);

  return (hours * 60) + minutes;

}

function convertTo12Hour(totalMinutes){

  let hours =
  Math.floor(totalMinutes / 60);

  let minutes =
  totalMinutes % 60;

  const ampm =
  hours >= 12 ? 'PM' : 'AM';

  hours =
  hours % 12 || 12;

  return `${hours}:${String(minutes).padStart(2,'0')} ${ampm}`;

}

// ======================
// RENDER SEATS
// ======================

function renderSeats(){

  seatContainer.innerHTML = '';

  const totalRows =
  movie.rows || 10;

  const totalCols =
  movie.cols || 12;

  // WALKWAY SETTINGS

  const leftGapAfter =
  movie.leftGapAfter || 3;

  const centerGapAfter =
  movie.centerGapAfter || 6;

  const rightGapAfter =
  movie.rightGapAfter || 9;

  for(
    let r = 1;
    r <= totalRows;
    r++
  ){

    const row =
    document.createElement('div');

    row.className =
    'd-flex justify-content-center align-items-center mb-2 flex-wrap';

    // ROW LABEL

    const rowLabel =
    document.createElement('div');

    rowLabel.className =
    'text-light fw-bold me-3';

    rowLabel.style.width =
    '30px';

    rowLabel.innerHTML =
    String.fromCharCode(64 + r);

    row.appendChild(rowLabel);

    for(
      let c = 1;
      c <= totalCols;
      c++
    ){

      // LEFT WALKWAY

      if(c === leftGapAfter + 1){

        const gap =
        document.createElement('div');

        gap.style.width =
        '20px';

        row.appendChild(gap);

      }

      // CENTER WALKWAY

      if(c === centerGapAfter + 1){

        const centerGap =
        document.createElement('div');

        centerGap.style.width =
        '50px';

        row.appendChild(centerGap);

      }

      // RIGHT WALKWAY

      if(c === rightGapAfter + 1){

        const gap =
        document.createElement('div');

        gap.style.width =
        '20px';

        row.appendChild(gap);

      }

      const seatId =
      `${String.fromCharCode(64 + r)}${c}`;

      const btn =
      document.createElement('button');

      btn.innerHTML = c;

      btn.className =
      'btn seat-btn m-1';

      btn.style.width =
      '45px';

      btn.style.height =
      '45px';

      // BOOKED

      if(
        bookedSeats.includes(seatId)
      ){

        btn.classList.add(
          'btn-danger'
        );

        btn.disabled = true;

      }

      // SELECTED

      else if(
        selectedSeats.includes(seatId)
      ){

        btn.classList.add(
          'btn-success'
        );

      }

      // AVAILABLE

      else{

        btn.classList.add(
          'btn-outline-light'
        );

      }

      btn.addEventListener(

        'click',

        () => toggleSeat(seatId)

      );

      row.appendChild(btn);

    }

    seatContainer.appendChild(row);

  }

}


// ======================
// TOGGLE SEATS
// ======================

function toggleSeat(seatId){

  if(
    selectedSeats.includes(seatId)
  ){

    selectedSeats =
    selectedSeats.filter(
      seat => seat !== seatId
    );

  }

  else{

    selectedSeats.push(seatId);

  }

  renderSeats();

  generatePaymentQR();

}

// ======================
// TIMER
// ======================

function startSeatTimer(){

  clearInterval(timerInterval);

  remainingSeconds = 300;

  paymentExpired = false;

  seatTimer.style.display = 'block';

  timerInterval = setInterval(() => {

    const mins =
    Math.floor(
      remainingSeconds / 60
    );

    const secs =
    remainingSeconds % 60;

    timerText.innerHTML =
    `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

    remainingSeconds--;

    if(remainingSeconds < 0){

      clearInterval(timerInterval);

      autoCancelSeats();

    }

  }, 1000);

}

// ======================
// AUTO CANCEL
// ======================

function autoCancelSeats(){

  paymentExpired = true;

  alert(
    'Payment expired. Seats released.'
  );

  selectedSeats = [];

  renderSeats();

  paymentSection.style.display =
  'none';

  seatTimer.style.display =
  'none';

}

// ======================
// PAYMENT QR
// ======================

async function generatePaymentQR(){

  if(selectedSeats.length === 0){

    paymentSection.style.display =
    'none';

    return;

  }

  paymentSection.style.display =
  'block';

  startSeatTimer();

  const totalAmount =
  selectedSeats.length *
  (movie.ticketPrice || 0);

  totalAmountText.innerHTML =
  totalAmount;

  const upiDoc =
  await getDoc(
    doc(db, 'settings', 'upi')
  );

  let upiData = {

    upiId: 'demo@upi',

    upiName: 'Dolly Movies'

  };

  if(upiDoc.exists()){

    upiData =
    upiDoc.data();

  }

  const upiUrl =
  `upi://pay?pa=${upiData.upiId}&pn=${upiData.upiName}&am=${totalAmount}&cu=INR`;

  const qrDiv =
  document.createElement('div');

  new QRCode(qrDiv, {

    text: upiUrl,

    width:250,

    height:250

  });

  const qrImage =
  qrDiv.querySelector('img');

  upiQr.src =
  qrImage.src;

}

// ======================
// LIVE UPDATES
// ======================

function enableLiveSeatUpdates(){

  onSnapshot(

    doc(db, 'movies', movieId),

    (snapshot) => {

      const updatedMovie =
      snapshot.data();

      if(updatedMovie){

        bookedSeats =
        updatedMovie.bookedSeats || [];

        renderSeats();

      }

    }

  );

}

// ======================
// PAYMENT VERIFY
// ======================

verifyPaymentBtn.addEventListener(

  'click',

  async () => {

    if(paymentExpired){

      alert(
        'QR expired. Please reselect seats.'
      );

      return;

    }

    verifyPaymentBtn.disabled =
    true;

    verifyPaymentBtn.innerHTML =
    'Processing...';

    const totalAmount =
    selectedSeats.length *
    (movie.ticketPrice || 0);

    await addDoc(

      collection(db, 'bookings'),

      {

        userId:
        auth.currentUser.uid,

        movieId,

        movieName:
        movie.movieName,

        theater:
        movie.theater,

        selectedSeats,

        selectedDate,

        selectedShow,

        totalAmount,

        paymentStatus:
        'PAID',

        createdAt:
        serverTimestamp()

      }

    );

    const updatedBookedSeats = [

      ...(movie.bookedSeats || []),

      ...selectedSeats

    ];

    await updateDoc(

      doc(db, 'movies', movieId),

      {

        bookedSeats:
        updatedBookedSeats

      }

    );

    generateTicketPDF(totalAmount);

    clearInterval(timerInterval);

    alert('Booking Successful');

    window.location.href =
    './dashboard.html';

  }

);

// ======================
// PDF
// ======================

function generateTicketPDF(totalAmount){

  const {
    jsPDF
  } = window.jspdf;

  const pdf =
  new jsPDF();

  pdf.setFontSize(22);

  pdf.text(
    'DOLLY MOVIES',
    20,
    20
  );

  pdf.setFontSize(14);

  pdf.text(
    `Movie: ${movie.movieName}`,
    20,
    40
  );

  pdf.text(
    `Theater: ${movie.theater}`,
    20,
    50
  );

  pdf.text(
    `Date: ${selectedDate}`,
    20,
    60
  );

  pdf.text(
    `Show: ${selectedShow}`,
    20,
    70
  );

  pdf.text(
    `Seats: ${selectedSeats.join(', ')}`,
    20,
    80
  );

  pdf.text(
    `Amount Paid: ₹${totalAmount}`,
    20,
    90
  );

  pdf.text(
    'Enjoy Your Movie!',
    20,
    110
  );

  pdf.save('ticket.pdf');

}

// ======================
// EVENTS
// ======================

dateSelect.addEventListener(

  'change',

  () => {

    selectedDate =
    dateSelect.value;

  }

);

showSelect.addEventListener(

  'change',

  () => {

    selectedShow =
    showSelect.value;

  }

);

// ======================
// INIT
// ======================

loadMovie();