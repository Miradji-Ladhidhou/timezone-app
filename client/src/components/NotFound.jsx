import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const { user } = useAuth();

  return (
    <Container className="text-center py-5">
      <h1 className="text-danger display-4">404 - Page introuvable</h1>
      <p className="text-muted mb-4">La page que vous recherchez n'existe pas ou a été déplacée.</p>

      <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
        {!user ? (
          <Button as={Link} to="/" variant="outline-primary">
            Retour à l’accueil
          </Button>
        ) : (
          <Button as={Link} to="/dashboard" variant="success">
            Aller au Dashboard
          </Button>
        )}
      </div>
    </Container>
  );
};

export default NotFound;
