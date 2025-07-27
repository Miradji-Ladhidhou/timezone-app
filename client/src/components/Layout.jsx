import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">TimeZone 🕒</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Accueil</Nav.Link>

              {/* Pour tous les utilisateurs */}
              {user?.role === 'employe' && (
                <>
                  <Nav.Link as={Link} to="/pointages">Pointages</Nav.Link>
                  <Nav.Link as={Link} to="/conges">Mes congés</Nav.Link>
                </>
              )}

              {/* Pour les secrétaires */}
              {user?.role === 'secretaire' && (
                <>
                  <Nav.Link as={Link} to="/conges">Gérer congés</Nav.Link>
                  <Nav.Link as={Link} to="/dates-bloquees">Dates bloquées</Nav.Link>
                </>
              )}

              {/* Pour les admins */}
              {user?.role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/users">Utilisateurs</Nav.Link>
                  <Nav.Link as={Link} to="/conges">Congés</Nav.Link>
                  <Nav.Link as={Link} to="/dates-bloquees">Dates bloquées</Nav.Link>
                </>
              )}
            </Nav>

            <Nav>
              <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
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
