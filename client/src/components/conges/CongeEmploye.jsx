import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Table, Button, Modal, Form, Badge, Row, Col, Alert, Card, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const CongeEmploye = () => {
  const { token, user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [mesConges, setMesConges] = useState([]);
  const [congesValides, setCongesValides] = useState([]);
  const [datesBloquees, setDatesBloquees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [debut, setDebut] = useState('');
  const [fin, setFin] = useState('');
  const [motif, setMotif] = useState('');
  const [alert, setAlert] = useState('');
  const [triMes, setTriMes] = useState({ colonne: 'createdAt', ordre: 'desc' });
  const [triValides, setTriValides] = useState({ colonne: 'createdAt', ordre: 'desc' });
  const [pageMes, setPageMes] = useState(1);
  const [pageValides, setPageValides] = useState(1);
  const parPage = 10;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  const fetchMesConges = useCallback(async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/conges/mes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMesConges(res.data);
  }, [token]);

  const fetchCongesValides = useCallback(async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/conges/valides`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCongesValides(res.data);
  }, [token]);

  const fetchDatesBloquees = useCallback(async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/dates-bloquees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDatesBloquees(res.data);
  }, [token]);

  useEffect(() => {
    fetchMesConges();
    fetchCongesValides();
    fetchDatesBloquees();
  }, [fetchMesConges, fetchCongesValides, fetchDatesBloquees]);

  const badgeStatut = (statut) => {
    switch (statut) {
      case 'en_attente': return <Badge bg="warning">En attente</Badge>;
      case 'valide': return <Badge bg="success">Validé</Badge>;
      case 'refuse': return <Badge bg="danger">Refusé</Badge>;
      default: return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  const handleTriMes = (colonne) => {
    setTriMes(prev => ({
      colonne,
      ordre: prev.colonne === colonne && prev.ordre === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleTriValides = (colonne) => {
    setTriValides(prev => ({
      colonne,
      ordre: prev.colonne === colonne && prev.ordre === 'asc' ? 'desc' : 'asc'
    }));
  };

  const trier = (array, colonne, ordre, isUserNom = false) => {
    return [...array].sort((a, b) => {
      let valA = isUserNom ? a.user?.nom?.toLowerCase() || '' : a[colonne];
      let valB = isUserNom ? b.user?.nom?.toLowerCase() || '' : b[colonne];
      if (['createdAt', 'updatedAt', 'dateDebut', 'dateFin'].includes(colonne)) {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = valA?.toString().toLowerCase() || '';
        valB = valB?.toString().toLowerCase() || '';
      }
      if (valA < valB) return ordre === 'asc' ? -1 : 1;
      if (valA > valB) return ordre === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const mesCongesTries = trier(mesConges, triMes.colonne, triMes.ordre);
  const congesValidesTries = trier(congesValides, triValides.colonne, triValides.ordre, triValides.colonne === 'user.nom');

  const mesPage = mesCongesTries.slice((pageMes - 1) * parPage, pageMes * parPage);
  const validesPage = congesValidesTries.slice((pageValides - 1) * parPage, pageValides * parPage);

  const handleDemande = async () => {
    setAlert('');
    const now = new Date().toISOString().split('T')[0];

    // Dates invalides → bloquant
    if (debut < now) return setAlert("❌ La date de début ne peut pas être dans le passé.");
    if (debut > fin) return setAlert("❌ La date de début ne peut pas être après la date de fin.");

    const messages = {
      bloquees: '',
      doublons: ''
    };

    if (datesBloquees.some(date => debut <= date.dateFin && fin >= date.dateDebut)) {
      messages.bloquees = "⚠️ La période chevauche une ou plusieurs **dates bloquées**.";
    }

    if (mesConges.some(c => debut <= c.dateFin && fin >= c.dateDebut)) {
      messages.doublons = "⚠️ Vous avez déjà une **demande sur cette période**.";
    }

    // Toujours confirmer si un avertissement est présent
    const hasWarnings = Object.values(messages).some(msg => msg);
    if (hasWarnings) {
      setPendingRequest({ type, dateDebut: debut, dateFin: fin, motif, messages });
      setShowConfirmation(true);
      return;
    }

    envoyerDemande({ type, dateDebut: debut, dateFin: fin, motif }, []);
  };

const envoyerDemande = async (data, messages = {}) => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/conges`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Reset
    setType(''); setDebut(''); setFin(''); setMotif('');
    setShowModal(false); setShowConfirmation(false); setPendingRequest(null);
    fetchMesConges(); fetchCongesValides();

    const messageFinal = "✅ Demande envoyée." +
      (messages.bloquees ? ` ${messages.bloquees}` : '') +
      (messages.doublons ? ` ${messages.doublons}` : '');

    setAlert(messageFinal);
    setTimeout(() => setAlert(''), 8000);
  } catch (err) {
    console.error("Erreur demande congé:", err);
    setAlert("❌ Une erreur est survenue.");
  }
};


  const pagination = (total, page, setPage) => (
    <Pagination className="mt-3 justify-content-center">
      {[...Array(Math.ceil(total / parPage)).keys()].map(num => (
        <Pagination.Item key={num + 1} active={num + 1 === page} onClick={() => setPage(num + 1)}>
          {num + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  return (
    <Container className="mt-4">
      {/* Confirmation */}
     <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
  <Modal.Header closeButton>
    <Modal.Title>⚠️ Confirmation requise</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {pendingRequest?.messages?.bloquees && (
      <Alert variant="warning">{pendingRequest.messages.bloquees}</Alert>
    )}
    {pendingRequest?.messages?.doublons && (
      <Alert variant="danger">{pendingRequest.messages.doublons}</Alert>
    )}
    <p>Souhaitez-vous continuer malgré ces avertissements ?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Annuler</Button>
    <Button variant="warning" onClick={() => envoyerDemande(pendingRequest, pendingRequest.messages)}>
      Oui, continuer
    </Button>
  </Modal.Footer>
</Modal>


      <Row className="mb-3">
        <Col><h3>Mes congés - {user?.nom}</h3></Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)} variant="primary">Demander un congé</Button>
        </Col>
      </Row>

      {/* Mes demandes */}
      <h5>Mes demandes</h5>
      {!isMobile ? (
        <>
          <Table bordered hover responsive className="mt-2">
            <thead>
              <tr>
                <th onClick={() => handleTriMes('type')} style={{ cursor: 'pointer' }}>Type {triMes.colonne === 'type' && (triMes.ordre === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleTriMes('dateDebut')} style={{ cursor: 'pointer' }}>Début {triMes.colonne === 'dateDebut' && (triMes.ordre === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleTriMes('dateFin')} style={{ cursor: 'pointer' }}>Fin {triMes.colonne === 'dateFin' && (triMes.ordre === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleTriMes('statut')} style={{ cursor: 'pointer' }}>Statut {triMes.colonne === 'statut' && (triMes.ordre === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleTriMes('createdAt')} style={{ cursor: 'pointer' }}>Demandé le {triMes.colonne === 'createdAt' && (triMes.ordre === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleTriMes('updatedAt')} style={{ cursor: 'pointer' }}>Mis à jour {triMes.colonne === 'updatedAt' && (triMes.ordre === 'asc' ? '▲' : '▼')}</th>
              </tr>
            </thead>
            <tbody>
              {mesPage.map(c => (
                <tr key={c.id}>
                  <td>{c.type}</td>
                  <td>{new Date(c.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(c.dateFin).toLocaleDateString()}</td>
                  <td>{badgeStatut(c.statut)}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination(mesConges.length, pageMes, setPageMes)}
        </>
      ) : (
        <Row>
          {mesPage.map(c => (
            <Col xs={12} key={c.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{c.type}</Card.Title>
                  <Card.Text>
                    Du {new Date(c.dateDebut).toLocaleDateString()} au {new Date(c.dateFin).toLocaleDateString()}<br />
                    {badgeStatut(c.statut)}<br />
                    Demandé le {new Date(c.createdAt).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Dates bloquées */}
      <h5 className="mt-4">Dates bloquées</h5>
      <Row>
        {datesBloquees.map(date => (
          <Col xs={12} md={6} lg={4} key={date.id} className="mb-3">
            <Card className="border-danger bg-light">
              <Card.Body>
                <Card.Title>
                  Du {new Date(date.dateDebut).toLocaleDateString()}<br />
                  au {new Date(date.dateFin).toLocaleDateString()}
                </Card.Title>
                <Card.Text className="text-muted small">
                  Motif : {date.motif || 'Non précisé'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Congés validés */}
      <h5 className="mt-4">Congés validés (tous les employés)</h5>
      {!isMobile ? (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleTriValides('user.nom')} style={{ cursor: 'pointer' }}>
                  Employé {triValides.colonne === 'user.nom' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTriValides('dateDebut')} style={{ cursor: 'pointer' }}>
                  Début {triValides.colonne === 'dateDebut' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTriValides('dateFin')} style={{ cursor: 'pointer' }}>
                  Fin {triValides.colonne === 'dateFin' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTriValides('createdAt')} style={{ cursor: 'pointer' }}>
                  Demandé le {triValides.colonne === 'createdAt' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {validesPage.map(c => (
                <tr key={c.id}>
                  <td>{c.user?.nom}</td>
                  <td>{new Date(c.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(c.dateFin).toLocaleDateString()}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination(congesValides.length, pageValides, setPageValides)}
        </>
      ) : (
        <Row>
          {validesPage.map(c => (
            <Col xs={12} key={c.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{c.user?.nom}</Card.Title>
                  <Card.Text>
                    Du {new Date(c.dateDebut).toLocaleDateString()} au {new Date(c.dateFin).toLocaleDateString()}<br />
                    Demandé le {new Date(c.createdAt).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal demande */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Nouvelle demande</Modal.Title></Modal.Header>
        <Modal.Body>
          {alert && <Alert variant="danger">{alert}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">-- Choisir --</option>
                <option value="Congé annuel">Congé annuel</option>
                <option value="RTT">RTT</option>
                <option value="Sans solde">Sans solde</option>
                <option value="Maladie">Maladie</option>
                <option value="Congé maternité">Congé maternité</option>
                <option value="Congé paternité">Congé paternité</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date de début</Form.Label>
              <Form.Control type="date" value={debut} onChange={(e) => setDebut(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Motif (facultatif)</Form.Label>
              <Form.Control as="textarea" rows={2} value={motif} onChange={(e) => setMotif(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleDemande}>Envoyer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CongeEmploye;
