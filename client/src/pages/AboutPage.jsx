import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <h1 className="text-center mb-4">À propos de TimeZone 🕒</h1>
        <p className="text-center text-muted mb-5">
          Une plateforme moderne pour simplifier la gestion des absences, des congés et du temps de travail.
        </p>

        <Row className="g-4">
          <Col xs={12} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title>Notre mission</Card.Title>
                <Card.Text>
                  Offrir aux entreprises et aux employés une solution fluide et intuitive pour suivre les congés, gérer les pointages et anticiper les jours bloqués.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title>Fonctionnalités clés</Card.Title>
                <ul className="small ps-3">
                  <li>Demande et suivi de congés</li>
                  <li>Pointage journalier d’entrée/sortie</li>
                  <li>Visualisation des dates bloquées</li>
                  <li>Gestion avancée des utilisateurs selon les rôles</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title>Pour qui ?</Card.Title>
                <Card.Text>
                  Que vous soyez un salarié, un secrétaire RH ou un administrateur d'entreprise, TimeZone s’adapte à vos besoins grâce à des rôles personnalisés.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title>Respect de la confidentialité</Card.Title>
                <Card.Text>
                  Vos données sont protégées. TimeZone respecte les standards de sécurité et la réglementation RGPD.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5 text-muted small">
          Pour toute question, contactez-nous à <a href="mailto:contact@timezone.app">contact@timezone.app</a>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
