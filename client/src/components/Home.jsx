import MyNav from "./MyNav";
import { Card, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MyFooter from "./MyFooter";
import Loading from "./Loading";
function Home(props) {
  const navigate = useNavigate();
  return (
    <>
      <MyNav user={props.user} logout={props.logout} />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
        fluid
      >
        {props.loading ?
        <Loading/>
        :<div className="w-75">
          <h1 className="text-center mb-4">Lista Voli</h1>
          {props.flights.map((flight) => (
            <Card key={flight.id} className="mb-4">
              <Card.Body>
                <Card.Title>{flight.type}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  File : {flight.rows}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Posti per Fila : {flight.seats}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Status : {flight.status ==1  ? "Disponibile" : "Non Disponibile "}
                </Card.Subtitle>

                {props.user ? (
                  <Button
                    variant="success"
                    className="float-right"
                    style={{ float: "right" }}
                    disabled={!flight.status }
                    onClick={() => navigate(`/flight/${flight.id}`)}
                  >
                    Prenota
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="float-right"
                    style={{ float: "right" }}
                    onClick={() => navigate(`/flight/${flight.id}`)}
                  >
                    Visualizza
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>}
        
       
      </Container>
      <MyFooter/>
    </>
  );
}
export default Home;
