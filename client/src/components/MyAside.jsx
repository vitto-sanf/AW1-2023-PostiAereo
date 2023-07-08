import { Card, Button, Alert, Row, Col } from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
function MyAside(props) {
  const [errorMsg, setErrorMsg] = useState("");

  function handleConfirm() {
    if (props.selectedSeats.length === 0) {
      setErrorMsg(
        "Seleziona almeno un posto o seleziona 'Selezione Automatica'"
      );
    } else {
      

      const e = {
        id_Ar: props.flightId,
        date: dayjs(),
        booked: props.selectedSeats,
      };

      props.addReservation(e);
      props.setLoading();
     
    }
  }

  return (
    <Card style={{ backgroundColor: "lightblue" }}>
      <Card.Body>
        {props.user ? (
          <>
            <Card.Title>Posti Totali:</Card.Title>
            <Card.Text> {props.rows * props.seats}</Card.Text>

            <Card.Title>Posti Disponibili:</Card.Title>
            <Card.Text>
              {" "}
              {props.rows * props.seats - props.bookedSeats.length}
            </Card.Text>

            <Card.Title>Posti Occupati:</Card.Title>
            <Card.Text> {props.bookedSeats.length}</Card.Text>

            <Card.Title>
              Posti selezionati: {props.selectedSeats.length}
            </Card.Title>
            {props.selectedSeats.map((seat, index) => (
              <Card.Text key={index}>- {seat}</Card.Text>
            ))}

            <Row>
              <Col lg={6} xs={12} className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  className="mt-2 "
                  onClick={handleConfirm}
                >
                  Conferma
                </Button>
              </Col>
              <Col lg={6} xs={12} className="d-flex justify-content-center">
                <Button
                  variant="danger"
                  className="mt-2 mr-2 "
                  onClick={props.cancelReservation}
                >
                  Annulla
                </Button>
              </Col>
              <Col className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  className="my-2"
                  onClick={props.modalShow}
                >
                  Selezione Automatca{" "}
                </Button>
              </Col>
            </Row>
            <Row></Row>
          </>
        ) : (
          <>
            <Card.Title>Posti Totali:</Card.Title>
            <Card.Text> {props.rows * props.seats}</Card.Text>

            <Card.Title>Posti Disponibili:</Card.Title>
            <Card.Text>
              {" "}
              {props.rows * props.seats - props.bookedSeats.length}
            </Card.Text>

            <Card.Title>Posti Occupati:</Card.Title>
            <Card.Text> {props.bookedSeats.length}</Card.Text>
          </>
        )}

        {errorMsg ? (
          <Alert
            variant="danger"
            className="ml-5"
            onClose={() => setErrorMsg("")}
            dismissible
          >
            {errorMsg}
          </Alert>
        ) : (
          false
        )}
      </Card.Body>
    </Card>
  );
}
export default MyAside;
