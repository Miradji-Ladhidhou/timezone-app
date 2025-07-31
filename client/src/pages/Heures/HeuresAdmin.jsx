import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Table, Button, Form, Card, Row, Col, Badge, Modal
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const HeuresAdmin = () => {
  const { token, user } = useAuth();
  const [heures, setHeures] = useState([]);
  const [page, setPage] = useState(1);
  const parPage = 10;
  const [triAsc] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [modifHeures, setModifHeures] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [validations, setValidations] = useState({});

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const fetchHeures = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/heures-supp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHeures(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchHeures();
  }, [fetchHeures]);

  const handleUpdateRecuperee = async (id) => {
    try {
      const valeurHeure = modifHeures[id];
      const minutes = parseInt(valeurHeure, 10) * 60;
      await axios.put(`${process.env.REACT_APP_API_URL}/heures-supp/${id}`, {
        heures_recuperees: minutes
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setValidations({ ...validations, [id]: true });
      setInfoMessage("Heures récupérées validées. Le reste sera reporté demain.");
      setShowModal(true);
      fetchHeures();
    } catch (err) {
      console.error(err);
    }
  };

  const trier = () => [...heures].sort((a, b) => triAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
  const paginer = (data) => data.slice((page - 1) * parPage, page * parPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/heures-supp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHeures();
    } catch (err) {
      console.error(err);
    }
  };

  const exporterCSV = () => {
    const lignes = [
      ['Utilisateur', 'Date', 'Normales', 'Travaillées', 'H. supp jour', 'H. supp J-1', 'Total supp (J+J-1)', 'Récupérées', 'Restantes', 'Statut'],
      ...heures.map(h => {
        const hier = new Date(h.date);
        hier.setDate(hier.getDate() - 1);
        const hierStr = hier.toISOString().split('T')[0];

        const hHier = heures.find(e => new Date(e.date).toISOString().split('T')[0] === hierStr);
        const suppJour = Math.floor((h.heures_supp || 0) / 60);
        const suppHier = hHier ? Math.floor((hHier.heures_restantes || 0) / 60) : 0;
        const totalSupp = suppJour + suppHier;
        const recup = Math.floor((h.heures_recuperees || 0) / 60);
        const restantes = Math.max(0, totalSupp - recup);

        return [
          h.User?.nom || 'Inconnu',
          new Date(h.date).toLocaleDateString(),
          `${Math.floor(h.heures_normales / 60)}h`,
          `${Math.floor(h.heures_travaillees / 60)}h`,
          `${suppJour}h`,
          `${suppHier}h`,
          `${totalSupp}h`,
          `${recup}h`,
          `${restantes}h`,
          h.statut
        ];
      })
    ];
    const csv = lignes.map(l => l.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'heures_supplementaires.csv';
    link.click();
  };

  const heuresPage = paginer(trier());
  const totalPages = Math.ceil(heures.length / parPage);
  const estAujourdhui = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString();
  const badgeStatut = (restantes) => {
    if (restantes === 0) return <Badge bg="success">Récupérées</Badge>;
    if (restantes > 0) return <Badge bg="warning">Restantes</Badge>;
    return <Badge bg="secondary">-</Badge>;
  };

  const mapHeures = {};
  heures.forEach(h => {
    const dateStr = new Date(h.date).toISOString().split('T')[0];
    mapHeures[dateStr] = h;
  });

  const getHier = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <Container className="mt-4">
      <h3>Gestion des heures supplémentaires</h3>
      <div className="d-flex justify-content-between mb-3">
        <Button size="sm" variant="outline-success" onClick={exporterCSV}>
          Exporter CSV
        </Button>
      </div>

      {!isMobile ? (
        <Table bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Date</th>
              <th>Travaillées</th>
              <th>H. supp jour</th>
              <th>H. supp restant J-1</th>
              <th>Total supp (J + J-1)</th>
              <th>Récupérées</th>
              <th>Restantes</th>
              <th>Action</th>
              <th>Statut</th>
              {user?.role === 'admin' && <th>Suppr</th>}
            </tr>
          </thead>
          <tbody>
            {heuresPage.map(h => {
              const hierStr = getHier(h.date);
              const today = estAujourdhui(h.date);
              const suppJour = Math.floor((h.heures_supp || 0) / 60);
              const suppHier = Math.floor((mapHeures[hierStr]?.heures_restantes || 0) / 60);
              const totalSupp = suppJour + suppHier;
              const recup = Math.floor((h.heures_recuperees || 0) / 60);
              const restantes = Math.max(0, totalSupp - recup);
              const editable = today && restantes > 0 && h.statut === 'non_recuperee';

              return (
                <tr key={h.id}>
                  <td>{h.User?.nom || 'Inconnu'}</td>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{Math.floor(h.heures_travaillees / 60)}h</td>
                  <td>{suppJour}h</td>
                  <td>{suppHier}h</td>
                  <td>{totalSupp}h</td>
                  <td>{recup}h</td>
                  <td>{restantes}h</td>
                  <td>
                    {editable ? (
                      <>
                        <Form.Control
                          type="number"
                          size="sm"
                          value={modifHeures[h.id] || ''}
                          onChange={(e) => setModifHeures({ ...modifHeures, [h.id]: e.target.value })}
                          placeholder="Heures à valider"
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          className="mt-1"
                          onClick={() => handleUpdateRecuperee(h.id)}
                        >
                          Valider
                        </Button>
                      </>
                    ) : (
                      badgeStatut(restantes * 60)
                    )}
                  </td>
                  <td>{h.statut}</td>
                  {user?.role === 'admin' && (
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(h.id)}>Supprimer</Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Row>
          {heuresPage.map(h => {
            const hierStr = getHier(h.date);
            const today = estAujourdhui(h.date);
            const suppJour = Math.floor((h.heures_supp || 0) / 60);
            const suppHier = Math.floor((mapHeures[hierStr]?.heures_restantes || 0) / 60);
            const totalSupp = suppJour + suppHier;
            const recup = Math.floor((h.heures_recuperees || 0) / 60);
            const restantes = Math.max(0, totalSupp - recup);
            const editable = today && restantes > 0 && h.statut === 'non_recuperee';

            return (
              <Col xs={12} key={h.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{h.User?.nom || 'Utilisateur inconnu'}</Card.Title>
                    <Card.Text><strong>Date :</strong> {new Date(h.date).toLocaleDateString()}</Card.Text>
                    <Card.Text><strong>Travaillées :</strong> {Math.floor(h.heures_travaillees / 60)}h</Card.Text>
                    <Card.Text><strong>H. supp jour :</strong> {suppJour}h</Card.Text>
                    <Card.Text><strong>H. supp restant J-1 :</strong> {suppHier}h</Card.Text>
                    <Card.Text><strong>Total supp :</strong> {totalSupp}h</Card.Text>
                    <Card.Text><strong>Récupérées :</strong> {recup}h</Card.Text>
                    <Card.Text><strong>Restantes :</strong> {restantes}h</Card.Text>
                    <Card.Text><strong>Statut :</strong> {h.statut}</Card.Text>
                    {editable ? (
                      <>
                        <Form.Control
                          type="number"
                          size="sm"
                          className="mt-2"
                          value={modifHeures[h.id] || ''}
                          onChange={(e) => setModifHeures({ ...modifHeures, [h.id]: e.target.value })}
                          placeholder="Heures à valider"
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          className="mt-2"
                          onClick={() => handleUpdateRecuperee(h.id)}
                        >Valider</Button>
                      </>
                    ) : badgeStatut(restantes * 60)}
                    {user?.role === 'admin' && (
                      <Button className="mt-2" size="sm" variant="danger" onClick={() => handleDelete(h.id)}>
                        Supprimer
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          <Col xs={12} className="d-flex justify-content-center">
            {[...Array(totalPages).keys()].map(num => (
              <Button
                key={num + 1}
                size="sm"
                className="m-1"
                variant={num + 1 === page ? 'primary' : 'outline-primary'}
                onClick={() => setPage(num + 1)}
              >{num + 1}</Button>
            ))}
          </Col>
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Confirmation</Modal.Title></Modal.Header>
        <Modal.Body>{infoMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HeuresAdmin;
