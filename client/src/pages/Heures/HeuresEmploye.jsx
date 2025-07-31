import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Table, Button, Form, Card, Row, Col, Badge, Modal
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const HeuresEmploye = () => {
  const { token } = useAuth();
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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/heures-supp/mes`, {
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

  const heuresPage = paginer(trier());
  const totalPages = Math.ceil(heures.length / parPage);

  const estAujourdhui = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString();

  const badgeStatut = (restantes) => {
    if (restantes === 0) return <Badge bg="success">Récupérées</Badge>;
    if (restantes > 0) return <Badge bg="warning">Restantes</Badge>;
    return <Badge bg="secondary">-</Badge>;
  };

  const getHier = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const mapHeures = {};
  heures.forEach(h => {
    const dateStr = new Date(h.date).toISOString().split('T')[0];
    mapHeures[dateStr] = h;
  });

  return (
    <Container className="mt-4">
      <h3>Mes heures supplémentaires</h3>
      {!isMobile ? (
        <Table bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Travaillées</th>
              <th>H. supp jour</th>
              <th>H. supp restant J-1</th>
              <th>Total supp (J + J-1)</th>
              <th>Récupérées</th>
              <th>Restantes</th>
              <th>Action</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {heuresPage.map(h => {
              const hierStr = getHier(h.date);
              const today = estAujourdhui(h.date);

              const heuresTravaillées = Math.floor((h.heures_travaillees || 0) / 60);
              const suppJour = Math.floor((h.heures_supp || 0) / 60);
              const restantesJ1 = mapHeures[hierStr]?.heures_restantes || 0;
              const restantesJ1Heures = Math.floor(restantesJ1 / 60);

              const totalSupp = suppJour + restantesJ1Heures;

              const recuperees = Math.floor((h.heures_recuperees || 0) / 60);
              const restantes = totalSupp - recuperees;

              const editable = today && restantes > 0 && h.statut === 'non_recuperee';

              return (
                <tr key={h.id}>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{heuresTravaillées}h</td>
                  <td>{suppJour}h</td>
                  <td>{restantesJ1Heures}h</td>
                  <td>{totalSupp}h</td>
                  <td>{recuperees}h</td>
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
                          className="mt-1"
                          onClick={() => handleUpdateRecuperee(h.id)}
                        >Validé</Button>
                      </>
                    ) : (
                      badgeStatut(restantes * 60)
                    )}
                  </td>
                  <td>{h.statut}</td>
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

            const heuresTravaillées = Math.floor((h.heures_travaillees || 0) / 60);
            const suppJour = Math.floor((h.heures_supp || 0) / 60);
            const restantesJ1 = mapHeures[hierStr]?.heures_restantes || 0;
            const restantesJ1Heures = Math.floor(restantesJ1 / 60);

            const totalSupp = suppJour + restantesJ1Heures;
            const recuperees = Math.floor((h.heures_recuperees || 0) / 60);
            const restantesCalculees = Math.max(0, totalSupp - recuperees);

            const editable = today && restantesCalculees > 0 && h.statut === 'non_recuperee';

            return (
              <Col xs={12} key={h.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{new Date(h.date).toLocaleDateString()}</Card.Title>
                    <Card.Text>
                      <strong>Travaillées :</strong> {heuresTravaillées}h<br />
                      <strong>H. supp jour :</strong> {suppJour}h<br />
                      <strong>H. restant J-1 :</strong> {restantesJ1Heures}h<br />
                      <strong>Total supp :</strong> {totalSupp}h<br />
                      <strong>Récupérées :</strong> {recuperees}h<br />
                      <strong>Restantes :</strong> {restantesCalculees}h<br />
                      <strong>Statut :</strong> {h.statut}
                    </Card.Text>

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
                    ) : badgeStatut(restantesCalculees * 60)}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

      )}

      <div className="d-flex justify-content-center mt-3">
        {[...Array(totalPages).keys()].map(num => (
          <Button
            key={num + 1}
            size="sm"
            className="m-1"
            variant={num + 1 === page ? 'primary' : 'outline-primary'}
            onClick={() => setPage(num + 1)}
          >{num + 1}</Button>
        ))}
      </div>

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

export default HeuresEmploye;
