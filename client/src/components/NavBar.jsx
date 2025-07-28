import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">TimeZone 🕒</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {user && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}

            {user?.role === 'employe' && (
              <>
                <Nav.Link as={Link} to="/pointages">Pointages</Nav.Link>
                <Nav.Link as={Link} to="/conges">Mes congés</Nav.Link>
              </>
            )}

            {user?.role === 'secretaire' && (
              <>
                <Nav.Link as={Link} to="/conges">Gérer congés</Nav.Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/users">Utilisateurs</Nav.Link>
                <Nav.Link as={Link} to="/conges">Congés</Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {user && (
              <Navbar.Text className="me-3 text-white">
                Bienvenue {user.nom}
              </Navbar.Text>
            )}
            {user ? (
              <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
