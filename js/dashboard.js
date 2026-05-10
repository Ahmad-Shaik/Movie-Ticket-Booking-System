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

  // LOAD USER NAME
  loadUserData(user.uid);

  // LOAD MOVIES
  loadMovies();

});

// ======================
// LOAD USER DATA
// ======================

async function loadUserData(uid){

  try {

    const userRef =
    doc(db, 'users', uid);

    const userSnap =
    await getDoc(userRef);

    if(userSnap.exists()){

      const user =
      userSnap.data();

      // ADMIN
      if(user.role === 'admin'){

        userName.innerHTML =
        '👑 ADMIN';

      }

      // USER
      else {

        userName.innerHTML =
        `👤 ${user.name}`;

      }

    }

  } catch(error){

    console.log(error);

  }

}

// ======================
// LOGOUT
// ======================

logoutBtn.addEventListener('click', async () => {

  await signOut(auth);

  window.location.href =
  './index.html';

});

// ======================
// LOAD MOVIES
// ======================

async function loadMovies(){

  try {

    moviesContainer.innerHTML = `
      <h3 class="text-center">
        Loading Movies...
      </h3>
    `;

    const querySnapshot =
    await getDocs(collection(db, 'movies'));

    allMovies = [];

    let places = [];
    let theaters = [];

    querySnapshot.forEach((docSnap) => {

      const movie = {
        id: docSnap.id,
        ...docSnap.data()
      };

      allMovies.push(movie);

      // UNIQUE PLACE
      if(!places.includes(movie.place)){

        places.push(movie.place);

      }

      // UNIQUE THEATER
      if(!theaters.includes(movie.theater)){

        theaters.push(movie.theater);

      }

    });

    // PLACE FILTER
    placeFilter.innerHTML =
    `
      <option value="">
        Select Place
      </option>
    `;

    places.forEach(place => {

      placeFilter.innerHTML += `
        <option value="${place}">
          ${place}
        </option>
      `;

    });

    // THEATER FILTER
    theaterFilter.innerHTML =
    `
      <option value="">
        Select Theater
      </option>
    `;

    theaters.forEach(theater => {

      theaterFilter.innerHTML += `
        <option value="${theater}">
          ${theater}
        </option>
      `;

    });

    renderMovies(allMovies);

  } catch(error){

    console.log(error);

    moviesContainer.innerHTML = `
      <h2 class="text-danger text-center">
        Failed To Load Movies
      </h2>
    `;

  }

}

// ======================
// RENDER MOVIES
// ======================

function renderMovies(movies){

  moviesContainer.innerHTML = '';

  // EMPTY
  if(movies.length === 0){

    moviesContainer.innerHTML = `
      <h3 class="text-center">
        No Movies Available
      </h3>
    `;

    return;
  }

  movies.forEach(movie => {

    moviesContainer.innerHTML += `

      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">

        <div class="card movie-card h-100 p-3">

          <img
            src="${movie.posterUrl}"
            class="img-fluid rounded mb-3"
            style="
              height:350px;
              object-fit:cover;
            "
          >

          <h4 class="mb-3">
            ${movie.movieName}
          </h4>

          <p>
            📍 ${movie.place}
          </p>

          <p>
            🎬 ${movie.theater}
          </p>

          <p>
            📅 ${movie.showDate}
          </p>

          <p>
            🕒 ${movie.showTime}
          </p>

          <p>
            💰 ₹${movie.ticketPrice}
          </p>

          <a
            href="./booking.html?id=${movie.id}"
            class="btn neon-btn mt-auto"
          >
            Book Now
          </a>

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