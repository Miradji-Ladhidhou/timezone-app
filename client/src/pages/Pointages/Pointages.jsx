import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Form, Modal
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Pointages = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pointages, setPointages] = useState([]);
  const [type, setType] = useState('entree');
  const [heureManuelle, setHeureManuelle] = useState('');
  const [triAsc, setTriAsc] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [showModalAlerte, setShowModalAlerte] = useState(false);
  const [alerteMessage, setAlerteMessage] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPointages = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/pointages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPointages(res.data);
    } catch (err) {
      console.error("Erreur récupération pointages", err);
      setAlerteMessage("Erreur lors de la récupération des pointages");
      setShowModalAlerte(true);
    }
  }, [token]);

  useEffect(() => {
    fetchPointages();
  }, [fetchPointages]);

  const ajouterPointage = async () => {
    try {
      const maintenant = new Date();
      const date = maintenant.toISOString().split('T')[0];
      const heure = heureManuelle || maintenant.toTimeString().split(':').slice(0, 2).join(':');

      const data = { type, date, heure };

      await axios.post(`${process.env.REACT_APP_API_URL}/pointages`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlerteMessage('Pointage ajouté avec succès');
      setShowModalAlerte(true);
      setHeureManuelle('');
      await fetchPointages();
    } catch (err) {
      setAlerteMessage(err.response?.data?.message || 'Erreur lors du pointage');
      setShowModalAlerte(true);
    }
  };

  const grouperParJour = () => {
    return [...pointages].sort((a, b) => triAsc
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
    );
  };

  const formaterHeure = (heure) => heure || '--';

  const formaterDate = (dateStr) => {
    const [date] = dateStr.split('T');
    return date.split('-').reverse().join('/');
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Suivi de mes pointages</h3>
        <Button variant="outline-primary" size="sm" onClick={() => navigate('/heures-supp')}>
          Voir mes heures supp
        </Button>
      </div>

      <Card className="p-3 shadow-sm mt-4">
        <h5>Ajouter un pointage</h5>
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="entree">Entrée</option>
                <option value="pause">Pause</option>
                <option value="reprise">Reprise</option>
                <option value="sortie">Sortie</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Heure (facultatif)</Form.Label>
              <Form.Control
                type="time"
                value={heureManuelle}
                onChange={(e) => setHeureManuelle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button variant="primary" className="w-100" onClick={ajouterPointage}>
              Valider
            </Button>
          </Col>
        </Row>
      </Card>

      <h5 className="mt-5 d-flex justify-content-between align-items-center">
        Historique
        <Button size="sm" variant="outline-secondary" onClick={() => setTriAsc(!triAsc)}>
          Trier {triAsc ? '▲' : '▼'}
        </Button>
      </h5>

      {!isMobile ? (
        <Table striped bordered hover responsive className="mt-2">
          <thead>
            <tr>
              <th>Date</th>
              <th>Entrée</th>
              <th>Pause</th>
              <th>Reprise</th>
              <th>Sortie</th>
            </tr>
          </thead>
          <tbody>
            {pointages.length === 0 ? (
              <tr><td colSpan={5} className="text-center">Aucun pointage</td></tr>
            ) : (
              grouperParJour().map(p => (
                <tr key={p.date}>
                  <td>{formaterDate(p.date)}</td>
                  <td>{formaterHeure(p.entree)}</td>
                  <td>{formaterHeure(p.pause)}</td>
                  <td>{formaterHeure(p.reprise)}</td>
                  <td>{formaterHeure(p.sortie)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      ) : (
        <Row className="mt-2">
          {grouperParJour().map(p => (
            <Col xs={12} key={p.date} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{formaterDate(p.date)}</Card.Title>
                  <Card.Text>
                    <strong>Entrée :</strong> {formaterHeure(p.entree)}<br />
                    <strong>Pause :</strong> {formaterHeure(p.pause)}<br />
                    <strong>Reprise :</strong> {formaterHeure(p.reprise)}<br />
                    <strong>Sortie :</strong> {formaterHeure(p.sortie)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModalAlerte} onHide={() => setShowModalAlerte(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alerteMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModalAlerte(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Pointages;
