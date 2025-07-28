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
  const [triValides, setTriValides] = useState({ colonne: 'createdAt', ordre: 'desc' });
  const [pageValides, setPageValides] = useState(1);
  const [pageMes, setPageMes] = useState(1);
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

  const handleTri = (colonne) => {
    setTriValides(prev => ({
      colonne,
      ordre: prev.colonne === colonne && prev.ordre === 'asc' ? 'desc' : 'asc'
    }));
  };

  const congesValidesTries = [...congesValides].sort((a, b) => {
    let valA = a[triValides.colonne], valB = b[triValides.colonne];
    if (triValides.colonne === 'user.nom') {
      valA = a.user?.nom?.toLowerCase() || '';
      valB = b.user?.nom?.toLowerCase() || '';
    } else if (['createdAt', 'dateDebut', 'dateFin'].includes(triValides.colonne)) {
      valA = new Date(valA);
      valB = new Date(valB);
    } else {
      valA = valA?.toString().toLowerCase() || '';
      valB = valB?.toString().toLowerCase() || '';
    }

    if (valA < valB) return triValides.ordre === 'asc' ? -1 : 1;
    if (valA > valB) return triValides.ordre === 'asc' ? 1 : -1;
    return 0;
  });

  const indexMes = (pageMes - 1) * parPage;
  const mesPage = mesConges.slice(indexMes, indexMes + parPage);
  const totalMes = Math.ceil(mesConges.length / parPage);

  const indexValides = (pageValides - 1) * parPage;
  const validesPage = congesValidesTries.slice(indexValides, indexValides + parPage);
  const totalValides = Math.ceil(congesValidesTries.length / parPage);

  const handleDemande = async () => {
    setAlert('');
    const now = new Date().toISOString().split('T')[0];

    if (debut < now) return setAlert("❌ La date de début ne peut pas être dans le passé.");

    const messages = [];

    const bloquee = datesBloquees.some(date => debut <= date.dateFin && fin >= date.dateDebut);
    if (bloquee) messages.push("⚠️ La période chevauche une date bloquée.");

    const doublon = mesConges.some(c => debut <= c.dateFin && fin >= c.dateDebut);
    if (doublon) messages.push("⚠️ Vous avez déjà une autre demande sur cette période.");

    // ✅ Si conflit, demander confirmation
    if (messages.length > 0) {
      setPendingRequest({ type, dateDebut: debut, dateFin: fin, motif, messages });
      setShowConfirmation(true);
      return;
    }

    // Sinon on envoie directement
    envoyerDemande({ type, dateDebut: debut, dateFin: fin, motif }, []);
  };


  const envoyerDemande = async (data, messages = []) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/conges`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setType('');
      setDebut('');
      setFin('');
      setMotif('');
      setShowModal(false);
      setShowConfirmation(false);
      setPendingRequest(null);

      fetchMesConges();
      fetchCongesValides();

      const finalMessage = ["✅ Demande envoyée."].concat(messages).join(' ');
      setAlert(finalMessage);
      setTimeout(() => setAlert(''), 8000);
    } catch (err) {
      console.error("Erreur demande congé:", err);
      setAlert("❌ Une erreur est survenue.");
    }
  };



  return (
    <Container className="mt-4">
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirmation requise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingRequest?.messages?.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
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
        <Col><h3>📅 Mes congés - {user?.nom}</h3></Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)} variant="primary">➕ Demander un congé</Button>
        </Col>
      </Row>

      {/* Mes congés */}
      <h5 className="mt-3">📋 Mes demandes</h5>
      {!isMobile ? (
        <>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Demandé le</th>
                <th>Mis à jour</th>
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
          <Pagination>
            {[...Array(totalMes).keys()].map(n => (
              <Pagination.Item key={n} active={n + 1 === pageMes} onClick={() => setPageMes(n + 1)}>
                {n + 1}
              </Pagination.Item>
            ))}
          </Pagination>
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
                    Demandé le {new Date(c.createdAt).toLocaleDateString()}<br />
                    {badgeStatut(c.statut)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Dates bloquées */}
      <h5 className="mt-4">🚫 Dates bloquées</h5>
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
      <h5 className="mt-4">✅ Congés validés (tous les employés)</h5>
      {!isMobile ? (
        <>
          <Table bordered responsive>
            <thead>
              <tr>
                <th onClick={() => handleTri('user.nom')} style={{ cursor: 'pointer' }}>
                  Employé {triValides.colonne === 'user.nom' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('dateDebut')} style={{ cursor: 'pointer' }}>
                  Début {triValides.colonne === 'dateDebut' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('dateFin')} style={{ cursor: 'pointer' }}>
                  Fin {triValides.colonne === 'dateFin' && (triValides.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('createdAt')} style={{ cursor: 'pointer' }}>
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
          <Pagination>
            {[...Array(totalValides).keys()].map(n => (
              <Pagination.Item key={n} active={n + 1 === pageValides} onClick={() => setPageValides(n + 1)}>
                {n + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      ) : (
        <Row>
          {validesPage.map(c => (
            <Col xs={12} key={c.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{c.user?.nom}</Card.Title>
                  <Card.Text>
                    Type : {c.type}<br />
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
