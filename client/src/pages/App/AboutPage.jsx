import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">À propos de <span className="text-primary">TimeZone 🕒</span></h2>
      <p className="text-center text-muted mb-5">
        Plateforme moderne de gestion des congés, pointages et temps de travail. Simple, efficace, sécurisée.
      </p>

      <Row className="g-4">
        <Col xs={12} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold">Notre mission</Card.Title>
              <Card.Text className="text-muted">
                Offrir une solution fluide et intuitive aux entreprises et aux employés pour gérer les congés, les pointages et anticiper les dates bloquées.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold">Fonctionnalités clés</Card.Title>
              <ul className="text-muted small ps-3 mb-0">
                <li>Demande et suivi des congés</li>
                <li>Pointage d'entrée / sortie journalier</li>
                <li>Visualisation des dates bloquées</li>
                <li>Gestion des utilisateurs par rôles</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold">Pour qui ?</Card.Title>
              <Card.Text className="text-muted">
                TimeZone s’adresse aux employés, secrétaires RH et administrateurs grâce à une interface adaptée aux rôles.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold">Respect de la confidentialité</Card.Title>
              <Card.Text className="text-muted">
                Vos données sont en sécurité. TimeZone respecte les normes de sécurité modernes et le RGPD.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-5 text-muted small">
        Une question ? Écrivez-nous à <a href="mailto:contact@timezone.app">contact@timezone.app</a>
      </div>
    </Container>
  );
};

export default AboutPage;
