import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Table, Button, Modal, Form, Badge, Row, Col, Alert, Card, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CongeGestion = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user && user.role === 'employe') {
      navigate('/conges');
    }
  }, [user, navigate]);

  const [conges, setConges] = useState([]);
  const [datesBloquees, setDatesBloquees] = useState([]);
  const [showModalDate, setShowModalDate] = useState(false);
  const [newDebut, setNewDebut] = useState('');
  const [newFin, setNewFin] = useState('');
  const [motifDate, setMotifDate] = useState('');
  const [alert, setAlert] = useState('');

  const [tri, setTri] = useState({ colonne: 'createdAt', ordre: 'desc' });
  const [page, setPage] = useState(1);
  const parPage = 10;

  const fetchConges = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/conges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConges(res.data);
    } catch (err) {
      console.error("Erreur fetch congés:", err);
    }
  }, [token]);

  const fetchDatesBloquees = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/dates-bloquees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDatesBloquees(res.data);
    } catch (err) {
      console.error("Erreur fetch dates bloquées:", err);
    }
  }, [token]);

  const deleteConge = async (id) => {
    if (!window.confirm("Supprimer ce congé ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/conges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchConges();
    } catch (err) {
      console.error("Erreur suppression congé:", err);
    }
  };

  const handleValidation = async (id, statut, motifRefus = null) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/conges/${id}`,
        { statut, motifRefus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConges();
    } catch (err) {
      console.error("Erreur validation congé:", err);
    }
  };

  const deleteDateBloquee = async (id) => {
    if (!window.confirm("Supprimer cette date bloquée ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/dates-bloquees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDatesBloquees();
    } catch (err) {
      console.error("Erreur suppression date bloquée:", err);
    }
  };

  const handleAjoutDateBloquee = async () => {
    if (!newDebut || !newFin) return setAlert("Veuillez compléter les deux dates.");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/dates-bloquees`,
        { dateDebut: newDebut, dateFin: newFin, motif: motifDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewDebut('');
      setNewFin('');
      setMotifDate('');
      setShowModalDate(false);
      fetchDatesBloquees();
    } catch (err) {
      console.error("Erreur ajout date bloquée:", err);
      setAlert("Erreur lors de l'ajout de la date bloquée.");
    }
  };

  useEffect(() => {
    fetchConges();
    fetchDatesBloquees();
  }, [fetchConges, fetchDatesBloquees]);

  const badgeStatut = (statut) => {
    switch (statut) {
      case 'en_attente': return <Badge bg="warning">En attente</Badge>;
      case 'valide': return <Badge bg="success">Validé</Badge>;
      case 'refuse': return <Badge bg="danger">Refusé</Badge>;
      default: return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  const handleTri = (colonne) => {
    setTri(prev => ({
      colonne,
      ordre: prev.colonne === colonne && prev.ordre === 'asc' ? 'desc' : 'asc'
    }));
  };

  const congesTries = [...conges].sort((a, b) => {
    let valA, valB;

    if (tri.colonne === 'user.nom') {
      valA = a.user?.nom?.toLowerCase() || '';
      valB = b.user?.nom?.toLowerCase() || '';
    } else if (tri.colonne === 'createdAt' || tri.colonne === 'dateDebut' || tri.colonne === 'dateFin') {
      valA = new Date(a[tri.colonne]);
      valB = new Date(b[tri.colonne]);
    } else {
      valA = a[tri.colonne]?.toString().toLowerCase() || '';
      valB = b[tri.colonne]?.toString().toLowerCase() || '';
    }

    if (valA < valB) return tri.ordre === 'asc' ? -1 : 1;
    if (valA > valB) return tri.ordre === 'asc' ? 1 : -1;
    return 0;
  });

  const detecterChevauchement = (conge) => {
    const chevaucheBloquee = datesBloquees.some(date =>
      conge.dateDebut <= date.dateFin && conge.dateFin >= date.dateDebut
    );

    const chevaucheConge = conges.some(c =>
      c.id !== conge.id && c.statut === 'valide' &&
      conge.dateDebut <= c.dateFin && conge.dateFin >= c.dateDebut
    );

    if (chevaucheBloquee) return 'Date bloquée';
    if (chevaucheConge) return 'Doublon congé';
    return 'RAS';
  };



  const indexDebut = (page - 1) * parPage;
  const congesPage = congesTries.slice(indexDebut, indexDebut + parPage);
  const totalPages = Math.ceil(congesTries.length / parPage);

  const pagination = (
    <Pagination className="mt-3">
      {[...Array(totalPages).keys()].map(num => (
        <Pagination.Item key={num + 1} active={num + 1 === page} onClick={() => setPage(num + 1)}>
          {num + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  return (
    <Container className="mt-4">
      <h3>🔧 Gestion des congés</h3>

      <h5 className="mt-4">Demandes de congés</h5>
      {!isMobile ? (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleTri('user.nom')} style={{ cursor: 'pointer' }}>
                  Employé {tri.colonne === 'user.nom' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('type')} style={{ cursor: 'pointer' }}>
                  Type {tri.colonne === 'type' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('dateDebut')} style={{ cursor: 'pointer' }}>
                  Début {tri.colonne === 'dateDebut' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('dateFin')} style={{ cursor: 'pointer' }}>
                  Fin {tri.colonne === 'dateFin' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('statut')} style={{ cursor: 'pointer' }}>
                  Statut {tri.colonne === 'statut' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('createdAt')} style={{ cursor: 'pointer' }}>
                  Demandé le {tri.colonne === 'createdAt' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th>Chevauchement</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {congesPage.map(c => (
                <tr key={c.id}>
                  <td>{c.user?.nom}</td>
                  <td>{c.type}</td>
                  <td>{new Date(c.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(c.dateFin).toLocaleDateString()}</td>
                  <td>{badgeStatut(c.statut)}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    {c.statut === 'en_attente' ? detecterChevauchement(c) : '-'}
                  </td>
                  <td>
                    {c.statut === 'en_attente' && (
                      <>
                        <Button size="sm" variant="success" onClick={() => handleValidation(c.id, 'valide')}>Valider</Button>{' '}
                        <Button size="sm" variant="danger" onClick={() => {
                          const motif = prompt('Motif du refus :');
                          if (motif) handleValidation(c.id, 'refuse', motif);
                        }}>Refuser</Button>{' '}
                      </>
                    )}
                    {!['valide', 'refuse'].includes(c.statut) && (
                      <Button size="sm" variant="outline-danger" onClick={() => deleteConge(c.id)}>🗑️</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination}
        </>
      ) : (
        <Row>
          {congesPage.map(c => (
            <Col xs={12} className="mb-3" key={c.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{c.user?.nom}</Card.Title>
                  <Card.Text><strong>Type :</strong> {c.type}</Card.Text>
                  <Card.Text><strong>Période :</strong> du {new Date(c.dateDebut).toLocaleDateString()} au {new Date(c.dateFin).toLocaleDateString()}</Card.Text>
                  <Card.Text><strong>Statut :</strong> {badgeStatut(c.statut)}</Card.Text>
                  <Card.Text><strong>Demandé le :</strong> {new Date(c.createdAt).toLocaleDateString()}</Card.Text>
                  {c.statut === 'en_attente' && (
                    <Card.Text>
                      <strong>Chevauchement :</strong> {detecterChevauchement(c)}
                    </Card.Text>
                  )}
                  {c.statut === 'en_attente' && (
                    <>
                      <Button size="sm" variant="success" onClick={() => handleValidation(c.id, 'valide')}>Valider</Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => {
                        const motif = prompt('Motif du refus :');
                        if (motif) handleValidation(c.id, 'refuse', motif);
                      }}>Refuser</Button>{' '}
                    </>
                  )}
                  {!['valide', 'refuse'].includes(c.statut) && (
                    <Button size="sm" variant="outline-danger" onClick={() => deleteConge(c.id)}>🗑️</Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
          <Col xs={12}>{pagination}</Col>
        </Row>
      )}

      {/* Dates bloquées */}
      <h5 className="mt-5 d-flex justify-content-between align-items-center">
        Dates bloquées
        <Button size="sm" variant="outline-primary" onClick={() => setShowModalDate(true)}>Ajouter</Button>
      </h5>

      <Row>
        {([...datesBloquees].sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))).map(date => (
          <Col xs={12} md={6} lg={4} key={date.id} className="mb-3">
            <Card className="border-danger bg-light h-100">
              <Card.Body>
                <Card.Title>
                  Du {new Date(date.dateDebut).toLocaleDateString()}<br />
                  au {new Date(date.dateFin).toLocaleDateString()}
                </Card.Title>
                <Card.Text className="text-muted small">
                  Motif : {date.motif || 'Non précisé'}
                </Card.Text>
                <Button variant="outline-danger" size="sm" onClick={() => deleteDateBloquee(date.id)}>
                  Supprimer
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Modal */}
      <Modal show={showModalDate} onHide={() => setShowModalDate(false)}>
        <Modal.Header closeButton><Modal.Title>Ajouter une date bloquée</Modal.Title></Modal.Header>
        <Modal.Body>
          {alert && <Alert variant="danger">{alert}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Date de début</Form.Label>
              <Form.Control type="date" value={newDebut} onChange={(e) => setNewDebut(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control type="date" value={newFin} onChange={(e) => setNewFin(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Motif (facultatif)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={motifDate}
                onChange={(e) => setMotifDate(e.target.value)}
                placeholder="Ex: Fermeture annuelle"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDate(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAjoutDateBloquee}>Ajouter</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CongeGestion;
