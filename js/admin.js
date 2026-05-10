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
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ======================
// ELEMENTS
// ======================

const logoutBtn =
document.getElementById('logoutBtn');

const addMovieBtn =
document.getElementById('addMovieBtn');

const moviesContainer =
document.getElementById('moviesContainer');

const usersTable =
document.getElementById('usersTable');

const saveUpiBtn =
document.getElementById('saveUpiBtn');

// SECTIONS
const moviesSection =
document.getElementById('moviesSection');

const usersSection =
document.getElementById('usersSection');

const upiSection =
document.getElementById('upiSection');

// TAB BUTTONS
const moviesTabBtn =
document.getElementById('moviesTabBtn');

const usersTabBtn =
document.getElementById('usersTabBtn');

const upiTabBtn =
document.getElementById('upiTabBtn');

// ======================
// AUTH CHECK
// ======================

onAuthStateChanged(auth, (user) => {

  if(!user){

    window.location.href =
    './index.html';

    return;
  }

  loadMovies();

  loadUsers();

});

// ======================
// LOGOUT
// ======================

logoutBtn.addEventListener('click', async () => {

  await signOut(auth);

  window.location.href =
  './index.html';

});

// ======================
// TAB SWITCHING
// ======================

moviesTabBtn.addEventListener('click', () => {

  moviesSection.style.display =
  'block';

  usersSection.style.display =
  'none';

  upiSection.style.display =
  'none';

});

usersTabBtn.addEventListener('click', () => {

  moviesSection.style.display =
  'none';

  usersSection.style.display =
  'block';

  upiSection.style.display =
  'none';

});

upiTabBtn.addEventListener('click', () => {

  moviesSection.style.display =
  'none';

  usersSection.style.display =
  'none';

  upiSection.style.display =
  'block';

});

// ======================
// ADD MOVIE
// ======================

addMovieBtn.addEventListener('click', async () => {

  const movieName =
  document.getElementById('movieName').value;

  const posterUrl =
  document.getElementById('posterUrl').value;

  const place =
  document.getElementById('place').value;

  const theater =
  document.getElementById('theater').value;

  const ticketPrice =
  document.getElementById('ticketPrice').value;

  const rows =
  document.getElementById('rows').value;

  const cols =
  document.getElementById('cols').value;

  const walkwayAfter =
  document.getElementById('walkwayAfter').value;

  const walkwayType =
  document.getElementById('walkwayType').value;

  const startDate =
  document.getElementById('startDate').value;

  const showTime =
  document.getElementById('showTime').value;

  if(
    !movieName ||
    !posterUrl ||
    !place ||
    !theater
  ){

    alert('Fill All Fields');

    return;
  }

  addMovieBtn.disabled = true;

  addMovieBtn.innerHTML =
  'Adding Movie...';

  try {

    await addDoc(collection(db, 'movies'), {

      movieName,
      posterUrl,
      place,
      theater,

      ticketPrice:
      Number(ticketPrice),

      rows:
      Number(rows),

      cols:
      Number(cols),

      walkwayAfter:
      Number(walkwayAfter),

      walkwayType,

      startDate,

      showTime,

      active: true,

      createdAt:
      new Date()

    });

    addMovieBtn.innerHTML =
    'Movie Added ✓';

    loadMovies();

    setTimeout(() => {

      location.reload();

    }, 1000);

  } catch(error){

    console.log(error);

    alert(error.message);

    addMovieBtn.disabled = false;

    addMovieBtn.innerHTML =
    'Add Movie';

  }

});

// ======================
// LOAD MOVIES
// ======================

async function loadMovies(){

  moviesContainer.innerHTML = '';

  const querySnapshot =
  await getDocs(collection(db, 'movies'));

  querySnapshot.forEach((docSnap) => {

    const movie = {
      id: docSnap.id,
      ...docSnap.data()
    };

    moviesContainer.innerHTML += `

      <div class="col-md-4 mb-4">

        <div class="neon-card movie-card p-3 h-100">

          <img
            src="${movie.posterUrl}"
            class="img-fluid rounded mb-3"
            style="
              height:350px;
              object-fit:cover;
            "
          >

          <h4 class="neon-heading">
            ${movie.movieName}
          </h4>

          <p>
            📍 ${movie.place}
          </p>

          <p>
            🎬 ${movie.theater}
          </p>

          <p>
            💰 ₹${movie.ticketPrice}
          </p>

          <p>
            🪑 ${movie.rows} x ${movie.cols}
          </p>

          <p>
            🚶 ${movie.walkwayType}
            after
            ${movie.walkwayAfter}
            seats
          </p>

          <p>
            📅 ${movie.startDate}
          </p>

          <p>
            🕒 ${movie.showTime}
          </p>

          <div class="d-flex gap-2 mt-3">

            <button
              class="btn neon-btn-green w-50"
              onclick="editMovie('${movie.id}')"
            >
              Edit
            </button>

            <button
              class="btn btn-danger w-50"
              onclick="deleteMovie('${movie.id}')"
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
// DELETE MOVIE
// ======================

window.deleteMovie =
async (id) => {

  const confirmDelete =
  confirm('Delete Movie?');

  if(!confirmDelete){

    return;
  }

  await deleteDoc(
    doc(db, 'movies', id)
  );

  loadMovies();

};

window.editMovie =
async (id) => {

  const movieName =
  prompt('Enter New Movie Name');

  if(!movieName){

    return;
  }

  const place =
  prompt('Enter New Place');

  const theater =
  prompt('Enter New Theater');

  const ticketPrice =
  prompt('Enter New Ticket Price');

  const showTime =
  prompt('Enter New Show Time');

  const posterUrl =
  prompt('Enter New Poster URL');

  const rows =
  prompt('Enter Rows');

  const cols =
  prompt('Enter Columns');

  const walkwayAfter =
  prompt('Walkway After Seats');

  const walkwayType =
  prompt('Walkway Type vertical/horizontal');

  const startDate =
  prompt('Movie Start Date');

  try {

    await setDoc(
      doc(db, 'movies', id),
      {

        movieName,
        place,
        theater,
        ticketPrice:
        Number(ticketPrice),

        showTime,

        posterUrl,

        rows:
        Number(rows),

        cols:
        Number(cols),

        walkwayAfter:
        Number(walkwayAfter),

        walkwayType,

        startDate,

        active:true

      }

    );

    alert('Movie Updated');

    loadMovies();

  } catch(error){

    console.log(error);

    alert(error.message);

  }

};

// ======================
// LOAD USERS
// ======================

async function loadUsers(){

  usersTable.innerHTML = '';

  const querySnapshot =
  await getDocs(collection(db, 'users'));

  querySnapshot.forEach((docSnap) => {

    const user =
    docSnap.data();

    usersTable.innerHTML += `

      <tr>

        <td>${user.name || '-'}</td>

        <td>${user.email || '-'}</td>

        <td>${user.phone || '-'}</td>

        <td>${user.address || '-'}</td>

      </tr>

    `;

  });

}

// ======================
// SAVE UPI
// ======================

saveUpiBtn.addEventListener('click', async () => {

  const upiId =
  document.getElementById('upiId').value;

  const upiName =
  document.getElementById('upiName').value;

  if(!upiId){

    alert('Enter UPI ID');

    return;
  }

  await setDoc(
    doc(db, 'settings', 'upi'),
    {
      upiId,
      upiName
    }
  );

  alert('UPI Updated');

});