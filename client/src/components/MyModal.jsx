import { Modal, Button, Form, Alert, Col, Row } from "react-bootstrap";
import { useState } from "react";
function MyModal(props) {
  const [passenger, setPassenger] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if(props.selectedSeats.length > 0 ){
      setErrorMsg('Hai già selezionato alcuni posti. Deselezionali per proseguire con la scelta automatica ')
    }
    else if(passenger<= 0){
        setErrorMsg('Seleziona almeno un posto')
    }else if (passenger > props.rows * props.seatsPerRow - props.bookedSeats.length) {
      setErrorMsg(
        `Non ci sono abbastanza posti per ${passenger} passeggeri `
      );
    }else{
        props.automaticReservation(passenger);
        props.onHide();
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Prenota in automatico i tuoi posti !
        </Modal.Title>
      </Modal.Header>
      {errorMsg ? (
        <Row className="justify-content-center mt-2">
          <Col  md={5}>
            <Alert
              variant="danger"
              className="ml-5"
              onClose={() => setErrorMsg("")}
              dismissible
            >
              {errorMsg}
            </Alert>
          </Col>
        </Row>
      ) : (
        false
      )}
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <h4>Seleziona il numero di passeggeri </h4>
          <Form.Group className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="number"
              name="passenger"
              value={passenger}
              onChange={(ev) => setPassenger(ev.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Conferma</Button>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default MyModal;
