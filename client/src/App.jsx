import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import PrenotaPosto from "./components/PrenotaPosto";
import Reservation from "./components/Reservation";
import API from "./API";

function App() {
  const [flights, setFlights] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const [initialLoading, setInitialLoading] = useState(true);
  const [reservationList, setReservationList] = useState([]);
  const [reservationError, setReservationError] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmMsg, setConfirmMsg ]= useState("")


  function handleError(err) {
    console.log("err: " + JSON.stringify(err)); // Only for debug
    let errMsg = "Unkwnown error";
    if (err.errors) {
      if(err.errors[0].msg){
        errMsg = err.errors[0].path +" : "+err.errors[0].msg;
      }else if(err.errors[0]){
        
        for (let i = 0; i < err.errors.length; i++) {
          const e = err.errors[i];
          console.log(e);
          setReservationError((oldList) => {
            return [...oldList, e];
          });
        }
        errMsg = `i posti ${err.errors} sono stati prenotati da un altro cliente `;
        
      }
     
    } else if (err.error) {
      errMsg = err.error;
    }

    setErrorMsg(errMsg);
    setTimeout(() => setDirty(true), 2000); // Fetch correct version from server, after a while
  }

  useEffect(() => {
    API.getAllFlights()
      .then((flightsList) => {
        setFlights(flightsList);
        setInitialLoading(false);
        setDirty(false)
      })
      .catch((err) => console.log(err));
  }, [dirty]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && dirty) {
      setInitialLoading(true)
      API.getReservationByUserId()
        .then((response) => {
          setReservationList(response);
          setDirty(false);
          setInitialLoading(false);
        })
        .catch((err) => handleError(err));
    }
  }, [user, dirty]);

  const addReservation = (e) => {
    setReservationList((oldList) => {
      const newTempId = Math.max(...oldList.map((e) => e.id)) + 1;
      e.id = newTempId;
      return [...oldList, e];
    });
    API.addReservation(e)
      .then(() => {
        setDirty(true)
        setConfirmMsg('Prenotazione avvenuta con successo')})
      .catch(
        (err) => {
          setDirty(true);
          setTimeout(()=>handleError(err),300)
          
        } 
      );
  };

  const deleteReservation = (id) => {
    
    API.deleteReservation(id)
      .then(() => {
        setDirty(true)
        setConfirmMsg("Cancellazione avvenuta con successo")
        
      })
      .catch((err) =>  handleError(err));
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);

    /* set state to empty if appropriate */
  };

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true); // load latest version of data, if appropriate
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home user={user} flights={flights} logout={doLogOut} loading= {initialLoading  } />}
          />
          <Route
            path="/flight/:flightId"
            element={
              <PrenotaPosto
                user={user}
                errorMsg={errorMsg}
                seatErrors={reservationError}
                resetErrorMsg={() => setErrorMsg("")}
                resetSeatError={() => setReservationError([])}
                confirmMsg= {confirmMsg}
                resetConfirmMsg={() => setConfirmMsg("")}
                addReservation={addReservation}
                logout={doLogOut}
              />
            }
          />
          <Route
            path="/reservations"
            element={
              <Reservation
                user={user}
                logout={doLogOut}
                deleteReservation={deleteReservation}
                reservationList={reservationList}
                resetErrorMsg={() => setErrorMsg("")}
                errorMsg={errorMsg}
                confirmMsg= {confirmMsg}
                resetConfirmMsg={() => setConfirmMsg("")}
                loading= {initialLoading  }
              />
            }
          />

          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <Login loginSuccessful={loginSuccessful} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
