import React from 'react';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Spinner animation="border" className="m-5" />;

  const { nom, role } = user;

  const renderAdminView = () => (
    <>
      <h2 className="mb-3">Bienvenue {nom}</h2>
      <p className="lead">
        Vous êtes connecté en tant qu’<strong>administrateur</strong>.
        Vous pouvez gérer les utilisateurs, les congés, les heures supplémentaires et les périodes bloquées.
      </p>

      <Row>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Utilisateurs</Card.Title>
              <Card.Text>Voir et gérer tous les comptes utilisateurs.</Card.Text>
              <Button variant="primary" onClick={() => navigate('/users')}>Voir les utilisateurs</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Congés</Card.Title>
              <Card.Text>Consulter, valider ou refuser les congés.</Card.Text>
              <Button variant="warning" onClick={() => navigate('/conges-gestion')}>Gérer les congés</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Gestion des pointages</Card.Title>
              <Card.Text>Modifier ou consulter les pointages des employés.</Card.Text>
              <Button variant="success" onClick={() => navigate('/gestion-pointages')}>Gérer les pointages</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Heures supplémentaires</Card.Title>
              <Card.Text>Suivi et export des heures au-delà du temps normal.</Card.Text>
              <Button variant="dark" onClick={() => navigate('/heures-suppGestion')}>Voir les heures supp</Button>
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
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Congés</Card.Title>
              <Card.Text>Validez ou refusez les congés des employés.</Card.Text>
              <Button variant="warning" onClick={() => navigate('/conges-gestion')}>Gérer les congés</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Gestion des pointages</Card.Title>
              <Card.Text>Consultez ou corrigez les heures de pointage des employés.</Card.Text>
              <Button variant="success" onClick={() => navigate('/gestion-pointages')}>Voir les pointages</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Heures supplémentaires</Card.Title>
              <Card.Text>Suivi et export des heures au-delà du temps normal.</Card.Text>
              <Button variant="dark" onClick={() => navigate('/heures-suppGestion')}>Voir les heures supp</Button>
            </Card.Body>
          </Card>
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
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Mes pointages</Card.Title>
              <Card.Text>Enregistrez vos heures d’arrivée, pause et départ chaque jour.</Card.Text>
              <Button variant="success" onClick={() => navigate('/pointages')}>Aller au pointage</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Mes congés</Card.Title>
              <Card.Text>Faire une demande de congé ou consulter l’historique.</Card.Text>
              <Button variant="info" onClick={() => navigate('/conges')}>Gérer mes congés</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Mes heures supplémentaires</Card.Title>
              <Card.Text>Voir le cumul des heures travaillées au-delà des 7h journalières.</Card.Text>
              <Button variant="dark" onClick={() => navigate('/heures-supp')}>Voir mes heures supp</Button>
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
