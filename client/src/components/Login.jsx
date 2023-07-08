import { useState } from "react";
import { Container, Card, Form, Button,Alert } from "react-bootstrap";
import MyNav from "./MyNav";
import { useNavigate } from "react-router-dom";
import API from '../API'

function Login (props)  {
  const [username, setUsername] = useState("vittorio@test.it");
  const [password, setPassword] = useState("pwd");
  const [errorMessage, setErrorMessage] = useState('') ;
  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then( user => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch(() => {
        setErrorMessage('Email o password errati');
      })
  }
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };

      // SOME VALIDATION, ADD MORE if needed (e.g., check if it is an email if an email is required, etc.)
      let valid = true;
      if(username === '' || password === '')
          valid = false;
      
      if(valid)
      {
        doLogIn(credentials);
      } else {
        // TODO: show a better error message...
        setErrorMessage('La email e la password non posso essere vuoti ')
      }
  };

  return (
    <>
      <MyNav />
      <Container
        className="d-flex justify-content-center align-items-center my-5"
        
      >
        <Card className="p-4">
          <h1 className="text-center mb-4">Entra nel tuo Account !</h1>
          <Form onSubmit={handleSubmit}>
          {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button  type="submit" className='my-2' variant="primary"  >
              Login
            </Button>
            <Button className='my-2 mx-2' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default Login;
