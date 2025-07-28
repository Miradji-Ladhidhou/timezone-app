// Dashboard.jsx
import React from 'react';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Spinner animation="border" className="m-5" />;

  const { nom, role } = user;

  const renderAdminView = () => (
    <>
      <h2 className="mb-3">Bienvenue {nom}</h2>
      <p className="lead">
        Vous êtes connecté en tant qu’<strong>administrateur</strong>.
        Vous pouvez gérer les utilisateurs, les congés et les périodes bloquées.
      </p>

      <Row>
        <Col md={4} sm={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Utilisateurs</Card.Title>
              <Card.Text>Voir et gérer tous les comptes utilisateurs.</Card.Text>
              <Button variant="primary" href="/users">Voir les utilisateurs</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Congés</Card.Title>
              <Card.Text>Consulter, valider ou refuser les congés.</Card.Text>
              <Button variant="warning" href="/conges">Gérer les congés</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderSecretaireView = () => (
    <>
      <h2 className="mb-3">Bienvenue {nom}</h2>
      <p className="lead">
        Vous êtes connecté en tant que <strong>secrétaire</strong>. 
        Vous avez accès à la gestion des congés et des dates bloquées.
      </p>

      <Row>
        <Col md={6} sm={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Congés</Card.Title>
              <Card.Text>Validez ou refusez les congés des employés.</Card.Text>
              <Button variant="warning" href="/conges">Gérer les congés</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12}>
        </Col>
      </Row>
    </>
  );

  const renderEmployeView = () => (
    <>
      <h2 className="mb-3">Bienvenue {nom}</h2>
      <p className="lead">
        Vous êtes connecté en tant qu’<strong>employé</strong>. Voici ce que vous pouvez faire :
      </p>

      <Row>
        <Col md={6} sm={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Mes pointages</Card.Title>
              <Card.Text>Enregistrez vos heures d’arrivée et de départ chaque jour.</Card.Text>
              <Button variant="success" href="/pointages">Aller au pointage</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Mes congés</Card.Title>
              <Card.Text>Faire une demande de congé ou consulter l’historique.</Card.Text>
              <Button variant="info" href="/conges">Gérer mes congés</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <Container className="mt-5">
      {role === 'admin' && renderAdminView()}
      {role === 'secretaire' && renderSecretaireView()}
      {role === 'employe' && renderEmployeView()}
    </Container>
  );
};

export default Dashboard;
