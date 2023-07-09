'use strict';
/* Data Access Object (DAO) module  */

const sqlite = require('sqlite3');


// open the database
const db = new sqlite.Database('postiAereo.sqlite3', (err) => {
  if(err) throw err;
});

//get all flights 
exports.listFlights = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM airplane ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const flights = rows.map((e) => ({ id: e.id, type: e.type, rows: e.rows, seats: e.seats, status: e.status, booked : e.booked }));
        resolve(flights);
      });
    });
  };

// get the flight identified by {id}
exports.getFlight = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT rows, seats FROM airplane a WHERE a.id ==? ';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Flight not found.'});
      } else {
        const flight = { rows: row.rows, seats: row.seats };
        resolve(flight);
      }
    });
  });
};

// get the booked seats of a flight identified by {id}
exports.getBookedSeats = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT booked FROM reservation r WHERE r.id_Airplane ==? ';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      const booked = rows.map((e)=> ({ booked: e.booked}));
      resolve(booked);
      
    });
  });
};

// get all the reservation related to a user id 
exports.getReservationByUserId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT reservation.id , id_Airplane, Date, booked, type, status FROM reservation JOIN airplane ON reservation.id_Airplane = airplane.id WHERE reservation.id_User ==? ';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      const reservation = rows.map((e)=> ({ id:e.id, id_Ar : e.id_Airplane , date: e.date , type: e.type, booked: e.booked } ));
      resolve(reservation);
      
    });
  });
};

// get a reservation related to a id 
exports.getReservationById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT airplane.id, status FROM reservation JOIN airplane ON reservation.id_Airplane = airplane.id WHERE reservation.id ==? ';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Reservation not found.'});
      } else {
        const reservation = { id_Ar : row.id, status : row.status } ;
        resolve(reservation);
      }
      
      
      
    });
  });
};


// add a new reservation
exports.createReservation = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO reservation (id_User,date,id_Airplane,booked) VALUES (?,DATE(?),?,?)';
    db.run(sql, [reservation.id_User, reservation.date, reservation.id_Ar, reservation.booked], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// delete an existing reservation
exports.deleteReservation = (id, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM reservation WHERE id = ? AND id_User = ?';  // Double-check that the answer belongs to the userId
    db.run(sql, [id, userId], function (err) {
      if (err) {
        reject(err);
        return;
      } else
        resolve(this.changes);  // return the number of affected rows
    });
  });
}

//update the status of existing airplane
exports.updateStatusFlight = (flightId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE airplane SET status=? WHERE id = ? ';  
    
    db.run(sql, [status, flightId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);
    });
  });
};
