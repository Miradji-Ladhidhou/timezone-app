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

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container className="text-center">
        {/* Header */}
        <h1 className="display-5 fw-bold mb-3">Bienvenue sur <span className="text-primary">TimeZone 🕒</span></h1>
        <p className="lead text-muted mb-5">
          Gérez vos congés, pointages et absences dans une interface simple et moderne.
        </p>

        {/* Section des fonctionnalités */}
        {isMobile ? (
          // Mobile : cartes empilées
          <>
            <Card className="mb-3 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="fs-4">Gérer vos congés</Card.Title>
                <Card.Text>
                  Faites vos demandes de congés facilement et suivez leur statut en temps réel.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="fs-4">Pointage rapide</Card.Title>
                <Card.Text>
                  Enregistrez vos heures d’arrivée et de sortie, et visualisez vos heures travaillées.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="fs-4">Dates bloquées</Card.Title>
                <Card.Text>
                  Consultez les jours non autorisés pour vos congés et planifiez en toute sérénité.
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        ) : (
          // Desktop : cartes en ligne
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fs-4">Gérer vos congés</Card.Title>
                  <Card.Text>
                    Faites vos demandes de congés facilement et suivez leur statut en temps réel.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fs-4">Pointage rapide</Card.Title>
                  <Card.Text>
                    Enregistrez vos heures d’arrivée et de sortie, et visualisez vos heures travaillées.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fs-4">Dates bloquées</Card.Title>
                  <Card.Text>
                    Consultez les jours non autorisés pour vos congés et planifiez en toute sérénité.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Appel à l'action */}
        <div className="mt-5">
          {!user ? (
            <>
              <p className="text-muted">Accédez à votre espace personnel pour commencer</p>
              <Button href="/login" variant="primary" size="lg">Se connecter</Button>
            </>
          ) : (
            <Button href="/dashboard" variant="success" size="lg">Accéder au Dashboard</Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
