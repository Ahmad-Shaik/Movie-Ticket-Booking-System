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

const showTime =
document.getElementById('showTime');

const showDate =
document.getElementById('showDate');

const bookingOpenDays =
document.getElementById('bookingOpenDays');

const addMovieBtn =
document.getElementById('addMovieBtn');

const moviesContainer =
document.getElementById('moviesContainer');

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

        showTime:
        showTime.value,

        showDate:
        showDate.value,

        bookingOpenDays:
        Number(
          bookingOpenDays.value
        )

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
          collection(db, 'movies'),
          movieData
        );

        alert(
          'Movie Added Successfully'
        );

      }

      // RESET

      editMovieId = null;

      addMovieBtn.innerHTML =
      'Add Movie';

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

    const movie = docSnap.data();

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
            📅 ${movie.showDate}
          </p>

          <p class="text-light">
            🕒 ${movie.showTime}
          </p>

          <p class="text-light">
            🎟 Booking Opens:
            ${movie.bookingOpenDays}
            day(s) before
          </p>

          <p class="text-light">
            💰 ₹${movie.ticketPrice}
          </p>

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

      showTime.value =
      movie.showTime;

      showDate.value =
      movie.showDate;

      bookingOpenDays.value =
      movie.bookingOpenDays;

      editMovieId = id;

      addMovieBtn.innerHTML =
      'Update Movie';

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
      doc(db, 'settings', 'upi'),
      {

        upiId:
        upiId.value,

        upiName:
        upiName.value

      }
    );

    alert('UPI Saved');

  }
);

// ======================
// INIT
// ======================

loadMovies();