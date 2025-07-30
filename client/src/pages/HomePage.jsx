import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      title: '📆 Gérer vos congés',
      description: 'Faites vos demandes de congés facilement et suivez leur statut en temps réel.'
    },
    {
      title: '🕒 Pointage rapide',
      description: 'Enregistrez vos heures d’arrivée et de sortie, et visualisez vos heures travaillées.'
    },
    {
      title: '🚫 Dates bloquées',
      description: 'Consultez les jours non autorisés pour vos congés et planifiez en toute sérénité.'
    }
  ];

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <h1 className="text-center mb-3 fw-bold display-6">
          Bienvenue sur <span className="text-primary">TimeZone 🕒</span>
        </h1>
        <p className="text-center text-muted mb-5">
          Gérez vos congés, pointages et absences dans une interface simple et moderne.
        </p>

        {isMobile ? (
          <>
            {features.map((f, i) => (
              <Card key={i} className="mb-3 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fs-5">{f.title}</Card.Title>
                  <Card.Text>{f.description}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </>
        ) : (
          <Row className="g-4 justify-content-center">
            {features.map((f, i) => (
              <Col key={i} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="fs-4">{f.title}</Card.Title>
                    <Card.Text>{f.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center mt-5">
          {!user ? (
            <>
              <p className="text-muted">Accédez à votre espace personnel pour commencer</p>
              <Button href="/login" variant="primary" size="lg">
                Se connecter
              </Button>
            </>
          ) : (
            <Button href="/dashboard" variant="success" size="lg">
              Accéder au Dashboard
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
