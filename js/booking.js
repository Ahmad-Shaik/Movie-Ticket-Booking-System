import {
      {

        bookedSeats:
        updatedBookedSeats

      }

    );

    generateTicketPDF(totalAmount);

    clearInterval(timerInterval);

    alert(
      'Booking Successful'
    );

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

  const pdf = new jsPDF();

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