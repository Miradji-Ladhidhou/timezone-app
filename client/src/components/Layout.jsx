import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">TimeZone 🕒</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/pointages">Pointages</Nav.Link>
              <Nav.Link as={Link} to="/conges">Congés</Nav.Link>
              <Nav.Link as={Link} to="/dates-bloquees">Dates bloquées</Nav.Link>
              <Nav.Link as={Link} to="/users">Utilisateurs</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
