import {
  auth,
  db
} from './firebase.js';

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ======================
// ELEMENTS
// ======================

const moviesContainer =
document.getElementById('moviesContainer');

const logoutBtn =
document.getElementById('logoutBtn');

const searchInput =
document.getElementById('searchInput');

const placeFilter =
document.getElementById('placeFilter');

const theaterFilter =
document.getElementById('theaterFilter');

const userName =
document.getElementById('userName');

// ======================
// VARIABLES
// ======================

let allMovies = [];

// ======================
// AUTH CHECK
// ======================

onAuthStateChanged(auth, async (user) => {

  if(!user){

    window.location.href =
    './index.html';

    return;
  }

  try {

    // LOAD USER

    const userRef =
    doc(db, 'users', user.uid);

    const userSnap =
    await getDoc(userRef);

    if(userSnap.exists()){

      const userData =
      userSnap.data();

      // ADMIN

      if(userData.role === 'admin'){

        userName.innerHTML =
        '👑 ADMIN';

      }

      // USER

      else {

        userName.innerHTML =
        `👤 ${userData.name}`;

      }

    }

    // LOAD MOVIES

    await loadMovies();

  } catch(error){

    console.log(error);

  }

});

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
// LOAD MOVIES
// ======================

async function loadMovies(){

  try {

    moviesContainer.innerHTML = `
      <h3 class="text-center text-light">
        Loading Movies...
      </h3>
    `;

    // FIRESTORE

    const querySnapshot =
    await getDocs(
      collection(db, 'movies')
    );

    allMovies = [];

    let places = [];

    let theaters = [];

    querySnapshot.forEach((docSnap) => {

      const movie = {

        id: docSnap.id,

        ...docSnap.data()

      };

      allMovies.push(movie);

      // UNIQUE PLACES

      if(
        !places.includes(movie.place)
      ){

        places.push(movie.place);

      }

      // UNIQUE THEATERS

      if(
        !theaters.includes(movie.theater)
      ){

        theaters.push(movie.theater);

      }

    });

    // ======================
    // PLACE FILTER
    // ======================

    placeFilter.innerHTML = `
      <option value="">
        All Places
      </option>
    `;

    places.forEach(place => {

      placeFilter.innerHTML += `
        <option value="${place}">
          ${place}
        </option>
      `;

    });

    // ======================
    // THEATER FILTER
    // ======================

    theaterFilter.innerHTML = `
      <option value="">
        All Theaters
      </option>
    `;

    theaters.forEach(theater => {

      theaterFilter.innerHTML += `
        <option value="${theater}">
          ${theater}
        </option>
      `;

    });

    // RENDER

    renderMovies(allMovies);

  } catch(error){

    console.log(error);

    moviesContainer.innerHTML = `
      <h3 class="text-danger text-center">
        Failed To Load Movies
      </h3>
    `;

  }

}

// ======================
// RENDER MOVIES
// ======================

function renderMovies(movies){

  moviesContainer.innerHTML = '';

  // NO MOVIES

  if(movies.length === 0){

    moviesContainer.innerHTML = `
      <h3 class="text-center text-light">
        No Movies Available
      </h3>
    `;

    return;
  }

  movies.forEach(movie => {

    // ======================
    // DATE FIX
    // ======================

    const releaseDate =
    movie.showDate || '';

    // TODAY

    const today =
    new Date();

    today.setHours(0,0,0,0);

    // MOVIE DATE

    let movieDate =
    new Date();

    if(releaseDate){

      movieDate =
      new Date(
        releaseDate + 'T00:00:00'
      );

    }

    // ======================
    // ADMIN BOOKING DAYS
    // ======================

    const bookingDays =
    Number(
      movie.bookingOpenDays || 1
    );

    // ======================
    // ENABLE DATE
    // ======================

    const enableDate =
    new Date(movieDate);

    enableDate.setDate(
      enableDate.getDate()
      -
      bookingDays
    );

    // ======================
    // ENABLE BOOKING
    // ======================

    const bookingEnabled =
    today >= enableDate;

    // ======================
    // STATUS BADGE
    // ======================

    let statusBadge = '';

    if(bookingEnabled){

      statusBadge = `
        <span class="badge bg-success mb-2">
          🎟 Booking Open
        </span>
      `;

    }

    else {

      statusBadge = `
        <span class="badge bg-warning text-dark mb-2">
          ⏳ Coming Soon
        </span>
      `;

    }

    // ======================
    // CARD
    // ======================

    moviesContainer.innerHTML += `

      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">

        <div class="neon-card movie-card h-100 p-3 d-flex flex-column">

          <!-- POSTER -->

          <img
            src="${movie.posterUrl}"
            class="img-fluid rounded mb-3"
            style="
              height:350px;
              object-fit:cover;
            "
          >

          <!-- BADGE -->

          ${statusBadge}

          <!-- TITLE -->

          <h4 class="neon-heading mb-3">
            ${movie.movieName}
          </h4>

          <!-- PLACE -->

          <p class="text-light">
            📍 ${movie.place}
          </p>

          <!-- THEATER -->

          <p class="text-light">
            🎬 ${movie.theater}
          </p>

          <!-- RELEASE DATE -->

          <p class="text-light">
            📅 Release:
            ${releaseDate || 'Not Set'}
          </p>

          <!-- SHOW TIME -->

          <p class="text-light">
            🕒 ${movie.showTime}
          </p>

          <!-- BOOKING DAYS -->

          <p class="text-light">
            🎟 Opens:
            ${bookingDays}
            day(s) before
          </p>

          <!-- PRICE -->

          <p class="text-light">
            💰 ₹${movie.ticketPrice}
          </p>

          <!-- BUTTON -->

          ${
            bookingEnabled

            ?

            `
              <a
                href="./booking.html?id=${movie.id}"
                class="btn neon-btn mt-auto"
              >
                Book Now
              </a>
            `

            :

            `
              <button
                class="btn btn-secondary mt-auto"
                disabled
              >
                Booking Opens Soon
              </button>
            `
          }

        </div>

      </div>

    `;

  });

}

// ======================
// FILTER MOVIES
// ======================

function filterMovies(){

  const search =
  searchInput.value.toLowerCase();

  const place =
  placeFilter.value;

  const theater =
  theaterFilter.value;

  const filteredMovies =
  allMovies.filter(movie => {

    return (

      movie.movieName
      .toLowerCase()
      .includes(search)

      &&

      (
        place === ''
        ||
        movie.place === place
      )

      &&

      (
        theater === ''
        ||
        movie.theater === theater
      )

    );

  });

  renderMovies(filteredMovies);

}

// ======================
// EVENTS
// ======================

searchInput.addEventListener(
  'input',
  filterMovies
);

placeFilter.addEventListener(
  'change',
  filterMovies
);

theaterFilter.addEventListener(
  'change',
  filterMovies
);