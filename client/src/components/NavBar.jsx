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
                <Nav.Link as={Link} to="/conges">Mes congés</Nav.Link>
                <Nav.Link as={Link} to="/pointages">Mes pointages</Nav.Link>
                <Nav.Link as={Link} to="/heures-supp">Mes heures-supp.</Nav.Link>
              </>
            )}

            {user?.role === 'secretaire' && (
              <>
                <Nav.Link as={Link} to="/conges-gestion">Gérer congés</Nav.Link>
                <Nav.Link as={Link} to="/gestion-pointages">Gérer pointages</Nav.Link>
                <Nav.Link as={Link} to="/heures-suppGestion">Gérer heures-supp</Nav.Link>

              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/users">Gérer utilisateurs</Nav.Link>
                <Nav.Link as={Link} to="/conges-gestion">Gérer congés</Nav.Link>
                <Nav.Link as={Link} to="/gestion-pointages">Gérer pointages</Nav.Link>
                <Nav.Link as={Link} to="/heures-suppGestion">Gérer heures-supp</Nav.Link>
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
