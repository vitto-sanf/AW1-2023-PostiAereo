import dayjs from "dayjs";

const URL = "http://localhost:3001/api";

async function getAllFlights() {
  const response = await fetch(URL + "/flights");
  const flights = await response.json();
  if (response.ok) {
    return flights.map((e) => ({
      id: e.id,
      type: e.type,
      rows: e.rows,
      seats: e.seats,
      status: e.status,
      booked: e.booked,
    }));
  } else {
    throw flights; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getFlightById(id) {
  const response = await fetch(URL + `/flights/${id}`);
  const flight = await response.json();
  if (response.ok) {
    const e = flight;
    return { rows: e.rows, seats: e.seats };
  } else {
    throw flight; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getBookedById(id) {
  const response = await fetch(URL + `/bookedSeats/${id}`);
  const bookings = await response.json();
  if (response.ok) {
    const groupedSeats = []; // Array per i posti prenotati
    bookings.forEach((booking) => {
      const bookedSeats = booking.booked; // ottengo il valore della chiave booked
      const seats = bookedSeats.split(","); // separo i valori utilizzando la ,
      groupedSeats.push(...seats); // riempio l' array con i posti prenotati
    });

    return groupedSeats;
  } else {
    throw bookings; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getReservationByUserId() {
  const response = await fetch(URL + `/userReservations`,{
     credentials: "include"
  });
  const reservations = await response.json();
  if (response.ok) {
    return reservations.map((e) => ({
      id: e.id,
      booked: e.booked,
      type: e.type,
      date: dayjs(e.date),
      id_Ar: e.id_Ar,
     
    }));
  } else {
    throw reservations; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function logIn(credentials) {
  let response = await fetch(URL + "/sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

/* User APIs */
async function logOut() {
  await fetch(URL + "/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(URL + "/sessions/current", {
    credentials: "include",
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

function addReservation(reservation){
  return new Promise((resolve, reject) => {
    fetch(URL+`/reservations`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, reservation, {date: reservation.date.format("YYYY-MM-DD")})),
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((id) => resolve(id))
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function deleteReservation(id) {
  // call  DELETE /api/answers/<id>
  return new Promise((resolve, reject) => {
    fetch(URL+`/reservations/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

const API = {
  getAllFlights,
  logOut,
  logIn,
  getUserInfo,
  getFlightById,
  getBookedById,
  getReservationByUserId,
  addReservation,
  deleteReservation
};
export default API;
