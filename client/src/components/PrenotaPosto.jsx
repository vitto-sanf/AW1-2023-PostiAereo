import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import MyNav from "./MyNav";
import { useParams, useNavigate } from "react-router-dom";
import API from "../API";
import MyAside from "./MyAside";
import MyModal from "./MyModal";
import { ArrowLeft } from "react-bootstrap-icons";
import MyFooter from "./MyFooter";
import Loading from "./Loading";

function SeatReservationPage(props) {
  const [rows, setRows] = useState(); // Numero di file
  const [seatsPerRow, setSeatsPerRow] = useState(); // Numero di posti per fila
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [errorSeats, setErrorSeats] = useState([]);
  const [modalShow, setModalShow] = useState(props.user && true);
  const [loading, setLoading] = useState(true);

  const { flightId } = useParams();
  const navigate = useNavigate();
  const letters = "ABCDEFG";

  //Caricamento dati per l'aereo selezionato
  useEffect(() => {
    const datiAreo = async () => {
      try {
        const postiTotali = await API.getFlightById(flightId);
        const postiOccupati = await API.getBookedById(flightId);
        setRows(postiTotali.rows);
        setSeatsPerRow(postiTotali.seats);
        setBookedSeats(postiOccupati);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    datiAreo();
  }, [flightId]);

  useEffect(() => {
    if (props.seatErrors.length > 0) {
      setLoading(false);
      setErrorSeats(props.seatErrors);
      setSelectedSeats([]);
      props.resetSeatError();
      setTimeout(() => {
        setErrorSeats([]);
        props.seatErrors.forEach((element) => {
          setBookedSeats((oldList) => {
            return [...oldList, element];
          });
        });
      }, 5000);
    } else if (props.confirmMsg) {
      setLoading(false);
      selectedSeats.forEach((element) => {
        setBookedSeats((oldList) => {
          return [...oldList, element];
        });
      });

      setSelectedSeats([]);
    } else if (props.errorMsg) {
      setLoading(false);
      setSelectedSeats([]);
    }
  }, [props.seatErrors, props.confirmMsg, props.errorMsg]);

  const automaticReservation = (nPassengers) => {
    let count = 0;

    while (count < nPassengers) {
      let row = Math.floor(Math.random() * rows) + 1;
      let seat = Math.floor(Math.random() * seatsPerRow);
      const seatNumber = `${row}${letters.charAt(seat)}`;

      if (
        !bookedSeats.includes(seatNumber) && !selectedSeats.includes(seatNumber)
      ) {
        selectedSeats.push(seatNumber);
        count++;
      }
    }
  };

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  //funzione per fare il render dei posti , essi verranno stampati come righe di una matrice 
  const renderSeats = () => {
    const seats = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];

      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = `${row}-${seat}`;

        const seatNumber = `${row}${letters.charAt(seat)}`;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        const error = errorSeats.includes(seatNumber);
        let seatStyle = "btn btn-outline-primary";
        if (isBooked) seatStyle = "btn btn-danger";
        else if (isSelected) seatStyle = "btn btn-warning";
        else if (error) seatStyle = "btn btn-danger";

        if (props.user) {
          rowSeats.push(
            <Button
              key={seatId}
              className="m-1"
              variant={seatStyle}
              disabled={isBooked}
              size="md"
              onClick={() => handleSeatClick(seatNumber)}
            >
              {seatNumber}
            </Button>
          );
        } else {
          rowSeats.push(
            <Button
              key={seatId}
              className="m-1"
              variant={isBooked ? "btn btn-danger" : "btn btn-outline-primary"}
              disabled={isBooked}
              size="md"
            >
              {seatNumber}
            </Button>
          );
        }
      }

      seats.push(
        <Row key={row} className="mt-3 justify-content-center">
          <Col className="d-flex justify-content-center">{rowSeats}</Col>
        </Row>
      );
    }

    return seats;
  };

  return (
    <>
      <MyNav user={props.user} logout={props.logout} />

      <Container className="mt-5">
        {loading ? (
          <Loading />
        ) : (
          <>
            <MyModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              automaticReservation={automaticReservation}
              seatsPerRow={seatsPerRow}
              bookedSeats={bookedSeats}
              rows={rows}
              selectedSeats={selectedSeats}
            />
            <Button
              variant="link"
              style={{ color: "gray" }}
              onClick={() => navigate("/")}
            >
              <ArrowLeft /> Indietro
            </Button>

            <Row>
              <Col md={8}>
                <h1 className="text-center">Seleziona i posti</h1>
                {props.errorMsg ? (
                  <Alert
                    variant="danger"
                    className="ml-5"
                    onClose={() => props.resetErrorMsg()}
                    dismissible
                  >
                    {props.errorMsg}
                  </Alert>
                ) : (
                  false
                )}

                {props.confirmMsg ? (
                  <Alert
                    variant="success"
                    className="ml-5"
                    onClose={() => props.resetConfirmMsg()}
                    dismissible
                  >
                    {props.confirmMsg}
                  </Alert>
                ) : (
                  false
                )}
                {renderSeats()}
              </Col>
              <Col md={4}>
                <MyAside
                  selectedSeats={selectedSeats}
                  rows={rows}
                  addReservation={props.addReservation}
                  flightId={flightId}
                  seats={seatsPerRow}
                  bookedSeats={bookedSeats}
                  user={props.user}
                  modalShow={() => setModalShow(true)}
                  cancelReservation={() => setSelectedSeats([])}
                  setLoading={() => setLoading(true)}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
      <MyFooter />
    </>
  );
}

export default SeatReservationPage;
