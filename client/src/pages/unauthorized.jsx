import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container className="text-center py-5">
      <h1 className="text-danger">🚫 Accès refusé</h1>
      <p className="text-muted">Vous n'avez pas l'autorisation d'accéder à cette page.</p>

      <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <Button variant="outline-primary" onClick={() => navigate('/')}>
          Accueil
        </Button>

        {user && (
          <Button variant="success" onClick={() => navigate('/dashboard')}>
            Aller au Dashboard
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Unauthorized;
