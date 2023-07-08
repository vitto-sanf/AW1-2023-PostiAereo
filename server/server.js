"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require("./dao"); // module for accessing the DB
const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // username and password for login
const session = require("express-session"); // enable sessions
const userDao = require("./user-dao"); // module for accessing the user info in the DB
const cors = require("cors");

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log("username:" + username + "passwd:" + password);
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti
const answerDelay = 500;

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated" });
};

// set up the session
app.use(
  session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: "wge8d239bwd93rkskb", // a secret value
    resave: false,
    saveUninitialized: false,
  })
);

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

//GET /api/flights

app.get("/api/flights", (req, res) => {
  dao
    .listFlights()
    .then((flights) => setTimeout(() => res.json(flights), answerDelay))
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

//GET /api/flights/<id>'
app.get("/api/flights/:id", async (req, res) => {
  try {
    const result = await dao.getFlight(req.params.id);
    if (result.error) {
      res.status(404).json(result);
    } else {
      setTimeout(() => res.json(result), answerDelay);
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

//GET /api/bookedSeats/<id>'
app.get("/api/bookedSeats/:id", async (req, res) => {
  try {
    const result = await dao.getBookedSeats(req.params.id);
    if (result.error) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

//GET /api/bookedSeats'
app.get("/api/userReservations", isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getReservationByUserId(req.user.id);
    if (result.error) {
      res.status(404).json(result);
    } else {
      setTimeout(() => res.json(result), answerDelay);
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

// POST /api/reservations
app.post(
  "/api/reservations",
  isLoggedIn,
  [check("date").isDate({ format: "YYYY-MM-DD", strictMode: true }),
     check("id_Ar").isInt(), check("booked").isArray({min:1})],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    

    try {
      const resultReservation = await dao.getReservationByUserId(req.user.id);

      //Controllo se l' utente ha già effettuato una prenotazione per quel volo 
      for (let i = 0; i < resultReservation.length; i++) {
        if (resultReservation[i].id_Ar === parseInt(req.body.id_Ar)) {
          return res
            .status(422)
            .json({ error: "Esiste già una prenotazione per questo volo " });
        }
      }

      //Controllo se i posti selezionati sono ancora disponibili 
      const allReservation = await dao.getBookedSeats(req.body.id_Ar);

      const notAvailable = [];

      for (let i = 0; i < req.body.booked.length; i++) {
        for (let j = 0; j < allReservation.length; j++) {
          if (allReservation[j].booked.includes(req.body.booked[i])) {
            notAvailable.push(req.body.booked[i]);
          }
        }
      }

      if (notAvailable.length > 0) {
        return res.status(422).json({ errors: notAvailable });
      }

      // Controllo se l'aereo è ancora disponibile o meno 
      const flightSize = await dao.getFlight(req.body.id_Ar)

      if(allReservation.length + req.body.booked.length === flightSize.rows*flightSize.seats){
        const updateRow = await dao.updateStatusFlight(req.body.id_Ar,0)
      }else if (allReservation.length + req.body.booked.length >= flightSize.rows*flightSize.seats){
        return res
        .status(422)
        .json({ error: "il numero di prenotazioni eccede quello dei posti totali dell' aereo " });
      }
      const seats = req.body.booked.join(",");

      const reservation = {
        id_Ar: req.body.id_Ar,
        date: req.body.date,
        booked: seats,
        id_User: req.user.id,
      };

      //console.log("answer to add: "+JSON.stringify(answer));

      const reservationId = await dao.createReservation(reservation);
     
      setTimeout(() => res.status(201).json(reservationId), answerDelay);
    } catch (err) {
      console.log(err);
      res.status(503).json({
        error: `Database error during the creation of reservation.`,
      });
    }
  }
);

// DELETE /api/reservations/<id>
app.delete("/api/reservations/:id", isLoggedIn, async (req, res) => {
  try {

    const reservation = await dao.getReservationById(req.params.id);
    console.log(reservation)
    if ( reservation.status === 0 ){
      await dao.updateStatusFlight(reservation.id_Ar,1)
    }
    const numRowChanges = await dao.deleteReservation(
      req.params.id,
      req.user.id
    );
    // number of changed rows is sent to client as an indicator of success
    setTimeout(() => res.json(numRowChanges), answerDelay);
  } catch (err) {
    console.log(err);
    res.status(503).json({
      error: `Database error during the deletion of answer ${req.params.id}.`,
    });
  }
});

/*** Users APIs ***/

// POST /sessions
// login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});
/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-qa-server listening at http://localhost:${port}`);
});
