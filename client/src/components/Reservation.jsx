import MyNav from "./MyNav";
import { Card, Container, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowLeft } from "react-bootstrap-icons";
import MyFooter from "./MyFooter";
import Loading from "./Loading";

function Reservation(props) {
  const navigate = useNavigate();
  return (
    <>
      <MyNav user={props.user} logout={props.logout} />

      {props.loading ? (
        <Loading />
      ) : (
        <>
          <Container
            className="d-flex justify-content-center "
            style={{ height: "100vh" }}
          >
            <div className="w-75">
              <Row>
                <Col md={2} style={{ display: "contents" }}>
                  <Button
                    variant="link"
                    style={{ color: "gray" }}
                    onClick={() => navigate("/")}
                  >
                    <ArrowLeft /> Indietro
                  </Button>
                </Col>
                <Col md={10}>
                  <h1 className="text-center mb-4">Le Tue Prenotazioni </h1>
                </Col>
              </Row>
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
              <Row>
                {props.reservationList.length > 0 ? (
                  props.reservationList.map((reservation) => (
                    <Col key={reservation.id} md={6}>
                      <Card className="mb-4">
                        <Card.Body>
                          <Card.Title>
                            Prenotazione #{reservation.id}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Aereo # : {reservation.id_Ar}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted">
                            Tipo Aereo : {reservation.type}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted">
                            Posti Prenotati : {reservation.booked}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted">
                            Data :{" "}
                            {dayjs(reservation.date).format("DD-MM-YYYY")}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted">
                            status :{reservation.status}
                            
                          </Card.Subtitle>

                          <Button
                            variant="danger"
                            className="float-right"
                            style={{ float: "right" }}
                            onClick={() =>
                              props.deleteReservation(reservation.id)
                            }
                          >
                            Cancella
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="fs-3 fw-light text-center">
                    Non esiste nessuna prenotazione a tuo nome. Clicca{" "}
                    <Link to={"/"} className="text-reset">
                      Qui
                    </Link>{" "}
                    per prenotare un posto in un nostro aereo{" "}
                  </p>
                )}
              </Row>
            </div>
          </Container>
          <MyFooter />
        </>
      )}
    </>
  );
}
export default Reservation;
