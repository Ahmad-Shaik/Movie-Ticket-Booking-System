// js/admin.js

import {
  auth,
  db
} from './firebase.js';

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ======================
// ELEMENTS
// ======================

const movieName =
document.getElementById('movieName');

const posterUrl =
document.getElementById('posterUrl');

const place =
document.getElementById('place');

const theater =
document.getElementById('theater');

const ticketPrice =
document.getElementById('ticketPrice');

const rows =
document.getElementById('rows');

const cols =
document.getElementById('cols');

const walkwayType =
document.getElementById('walkwayType');

const walkwayAfter =
document.getElementById('walkwayAfter');

const showDate =
document.getElementById('showDate');

const runDays =
document.getElementById('runDays');

const bookingOpenDays =
document.getElementById('bookingOpenDays');

const showTime =
document.getElementById('showTime');

const movieDuration =
document.getElementById('movieDuration');

const closingTime =
document.getElementById('closingTime');

const intervalTime =
document.getElementById('intervalTime');

const cleaningTime =
document.getElementById('cleaningTime');

const addMovieBtn =
document.getElementById('addMovieBtn');

const moviesContainer =
document.getElementById('moviesContainer');

const usersTableBody =
document.getElementById('usersTableBody');

const bookingsTableBody =
document.getElementById('bookingsTableBody');

const logoutBtn =
document.getElementById('logoutBtn');

const upiId =
document.getElementById('upiId');

const upiName =
document.getElementById('upiName');

const saveUpiBtn =
document.getElementById('saveUpiBtn');

// ======================
// EDIT MODE
// ======================

let editMovieId = null;

// ======================
// TIME HELPERS
// ======================

function convertToMinutes(time){

  const parts =
  time.split(':');

  return (
    Number(parts[0]) * 60 +
    Number(parts[1])
  );

}

function minutesToTime(minutes){

  const hrs =
  Math.floor(minutes / 60);

  const mins =
  minutes % 60;

  return `${
    String(hrs).padStart(2,'0')
  }:${
    String(mins).padStart(2,'0')
  }`;

}

// ======================
// AUTO GENERATE SHOWS
// ======================

function generateShows(){

  const shows = [];

  let current =
  convertToMinutes(
    showTime.value
  );

  const close =
  convertToMinutes(
    closingTime.value
  );

  const duration =
  Number(movieDuration.value);

  const interval =
  Number(intervalTime.value);

  const cleaning =
  Number(cleaningTime.value);

  let count = 1;

  while(

    current + duration <= close

  ){

    shows.push({

      showName:
      `${count} Show`,

      startTime:
      minutesToTime(current)

    });

    current +=
    duration +
    interval +
    cleaning;

    count++;

  }

  return shows;

}

// ======================
// LOGOUT
// ======================

logoutBtn.addEventListener(
  'click',
  async () => {

    await signOut(auth);

    window.location.href =
    './index.html';

  }
);

// ======================
// ADD / UPDATE MOVIE
// ======================

addMovieBtn.addEventListener(
  'click',
  async () => {

    try {

      addMovieBtn.disabled = true;

      addMovieBtn.innerHTML =
      editMovieId
      ?
      'Updating Movie...'
      :
      'Adding Movie...';

      const movieData = {

        movieName:
        movieName.value,

        posterUrl:
        posterUrl.value,

        place:
        place.value,

        theater:
        theater.value,

        ticketPrice:
        Number(ticketPrice.value),

        rows:
        Number(rows.value),

        cols:
        Number(cols.value),

        walkwayType:
        walkwayType.value,

        walkwayAfter:
        Number(walkwayAfter.value),

        showDate:
        showDate.value,

        runDays:
        Number(runDays.value),

        bookingOpenDays:
        Number(
          bookingOpenDays.value
        ),

        showTime:
        showTime.value,

        movieDuration:
        Number(
          movieDuration.value
        ),

        closingTime:
        closingTime.value,

        intervalTime:
        Number(
          intervalTime.value
        ),

        cleaningTime:
        Number(
          cleaningTime.value
        ),

        shows:
        generateShows()

      };

      // UPDATE

      if(editMovieId){

        await updateDoc(

          doc(
            db,
            'movies',
            editMovieId
          ),

          movieData

        );

        alert(
          'Movie Updated Successfully'
        );

      }

      // ADD

      else {

        await addDoc(

          collection(
            db,
            'movies'
          ),

          movieData

        );

        alert(
          'Movie Added Successfully'
        );

      }

      location.reload();

    } catch(error){

      console.log(error);

      alert(error.message);

    }

  }
);

// ======================
// LOAD MOVIES
// ======================

async function loadMovies(){

  moviesContainer.innerHTML = '';

  const querySnapshot =
  await getDocs(
    collection(db, 'movies')
  );

  querySnapshot.forEach((docSnap) => {

    const movie =
    docSnap.data();

    moviesContainer.innerHTML += `

      <div class="col-md-4 mb-4">

        <div class="neon-card p-3 h-100">

          <img
            src="${movie.posterUrl}"
            class="img-fluid rounded mb-3"
            style="
              height:300px;
              object-fit:cover;
              width:100%;
            "
          >

          <h4 class="neon-heading">
            ${movie.movieName}
          </h4>

          <p class="text-light">
            📍 ${movie.place}
          </p>

          <p class="text-light">
            🎬 ${movie.theater}
          </p>

          <p class="text-light">
            📅 Start:
            ${movie.showDate}
          </p>

          <p class="text-light">
            📆 Runs:
            ${movie.runDays} Days
          </p>

          <p class="text-light">
            🕒 First Show:
            ${movie.showTime}
          </p>

          <p class="text-light">
            🎞 Duration:
            ${movie.movieDuration}
            mins
          </p>

          <p class="text-light">
            🏢 Closes:
            ${movie.closingTime}
          </p>

          <p class="text-light">
            ⏸ Interval:
            ${movie.intervalTime}
            mins
          </p>

          <p class="text-light">
            🧹 Cleaning:
            ${movie.cleaningTime}
            mins
          </p>

          <p class="text-light">
            🎟 Booking Opens:
            ${movie.bookingOpenDays}
            day(s) before
          </p>

          <div class="mb-3">

            ${
              movie.shows
              ?
              movie.shows.map(show => `

                <div class="
                  badge
                  bg-info
                  text-dark
                  me-1
                  mb-1
                ">

                  ${show.showName}
                  -
                  ${show.startTime}

                </div>

              `).join('')
              :
              ''
            }

          </div>

          <div class="d-flex gap-2">

            <button
              class="btn btn-warning w-50"
              onclick="editMovie('${docSnap.id}')"
            >
              Edit
            </button>

            <button
              class="btn btn-danger w-50"
              onclick="deleteMovie('${docSnap.id}')"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    `;

  });

}

// ======================
// LOAD USERS
// ======================

async function loadUsers(){

  usersTableBody.innerHTML = '';

  const querySnapshot =
  await getDocs(
    collection(db, 'users')
  );

  querySnapshot.forEach((docSnap) => {

    const user =
    docSnap.data();

    usersTableBody.innerHTML += `

      <tr>

        <td>${user.name || ''}</td>

        <td>${user.email || ''}</td>

        <td>${user.phone || ''}</td>

        <td>${user.address || ''}</td>

      </tr>

    `;

  });

}

// ======================
// LOAD BOOKINGS
// ======================

async function loadBookings(){

  bookingsTableBody.innerHTML = '';

  const querySnapshot =
  await getDocs(
    collection(db, 'bookings')
  );

  querySnapshot.forEach((docSnap) => {

    const booking =
    docSnap.data();

    bookingsTableBody.innerHTML += `

      <tr>

        <td>
          ${booking.userName || ''}
        </td>

        <td>
          ${booking.movieName || ''}
        </td>

        <td>
          ${booking.theater || ''}
        </td>

        <td>
          ${
            booking.selectedSeats
            ?
            booking.selectedSeats.join(', ')
            :
            ''
          }
        </td>

        <td>
          ${booking.selectedDate || ''}
        </td>

        <td>
          ${booking.selectedShow || ''}
        </td>

        <td>
          ₹${booking.totalAmount || 0}
        </td>

      </tr>

    `;

  });

}

// ======================
// EDIT MOVIE
// ======================

window.editMovie =
async function(id){

  const querySnapshot =
  await getDocs(
    collection(db, 'movies')
  );

  querySnapshot.forEach((docSnap) => {

    if(docSnap.id === id){

      const movie =
      docSnap.data();

      movieName.value =
      movie.movieName;

      posterUrl.value =
      movie.posterUrl;

      place.value =
      movie.place;

      theater.value =
      movie.theater;

      ticketPrice.value =
      movie.ticketPrice;

      rows.value =
      movie.rows;

      cols.value =
      movie.cols;

      walkwayType.value =
      movie.walkwayType;

      walkwayAfter.value =
      movie.walkwayAfter;

      showDate.value =
      movie.showDate;

      runDays.value =
      movie.runDays;

      bookingOpenDays.value =
      movie.bookingOpenDays;

      showTime.value =
      movie.showTime;

      movieDuration.value =
      movie.movieDuration;

      closingTime.value =
      movie.closingTime;

      intervalTime.value =
      movie.intervalTime;

      cleaningTime.value =
      movie.cleaningTime;

      editMovieId = id;

      addMovieBtn.innerHTML =
      'Update Movie';

      showSection(
        'movieSection'
      );

      window.scrollTo({

        top:0,

        behavior:'smooth'

      });

    }

  });

}

// ======================
// DELETE MOVIE
// ======================

window.deleteMovie =
async function(id){

  const confirmDelete =
  confirm(
    'Delete this movie?'
  );

  if(!confirmDelete){

    return;
  }

  await deleteDoc(
    doc(db, 'movies', id)
  );

  loadMovies();

}

// ======================
// SAVE UPI
// ======================

saveUpiBtn.addEventListener(
  'click',
  async () => {

    await setDoc(

      doc(
        db,
        'settings',
        'upi'
      ),

      {

        upiId:
        upiId.value,

        upiName:
        upiName.value

      }

    );

    alert(
      'UPI Saved Successfully'
    );

  }
);

// ======================
// INIT
// ======================

loadMovies();

loadUsers();

loadBookings();