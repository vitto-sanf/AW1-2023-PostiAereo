import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate ,Link} from "react-router-dom";
function MyNav(props) {
  const navigate = useNavigate();
  const name = props.user && props.user.name;

  const handleLogout =()=>{
    props.logout();
    navigate('/')
  }
  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Link to={'/'}> <Button variant="outline-transparent">  <Navbar.Brand > Fly Booking </Navbar.Brand></Button> </Link>
        
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar" className="justify-content-end">
          {name ? (
            <>
              <Link to={'/reservations'} style={{textDecoration: "none"}}> <Navbar.Text className="mx-2 mt-3" >Prenotazioni</Navbar.Text></Link>
              <Navbar.Text className="fs-5">
                {"Signed in as: " + name}
              </Navbar.Text>
              <Button className="mx-2" variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button
              className="mx-2"
              variant="warning"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default MyNav;
