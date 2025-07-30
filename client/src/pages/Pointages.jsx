// src/pages/Pointages.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Form, Alert
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Pointages = () => {
  const { token } = useAuth();
  const [pointages, setPointages] = useState([]);
  const [type, setType] = useState('entree');
  const [heureManuelle, setHeureManuelle] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [duree, setDuree] = useState('');
  const [heuresSupp, setHeuresSupp] = useState(0);
  const [heuresARecup, setHeuresARecup] = useState(0);
  const [triAsc, setTriAsc] = useState(true);
  const HEURES_NORMALES_MIN = 420;

  const fetchPointages = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/pointages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPointages(res.data);
    } catch (err) {
      console.error("Erreur récupération pointages", err);
    }
  }, [token]);

  const fetchHeures = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/pointages/duree/aujourdhui`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const total = res.data.totalMinutes || 0;
      setDuree(res.data.dureeTravail);
      setHeuresSupp(Math.max(0, total - HEURES_NORMALES_MIN));
      setHeuresARecup(Math.max(0, HEURES_NORMALES_MIN - total));
    } catch (err) {
      console.error("Erreur calcul heures", err);
    }
  }, [token]);

  useEffect(() => {
    fetchPointages();
    fetchHeures();
  }, [fetchPointages, fetchHeures]);

  const ajouterPointage = async () => {
    try {
      setErreur('');
      const maintenant = new Date();
      const date = maintenant.toISOString().split('T')[0];
      const heure = heureManuelle || maintenant.toTimeString().split(':').slice(0, 2).join(':');

      const data = { type, date, heure };

      await axios.post(`${process.env.REACT_APP_API_URL}/pointages`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('✅ Pointage ajouté');
      setHeureManuelle('');
      await fetchPointages();
      await fetchHeures();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors du pointage');
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
      <h3>🕓 Suivi de mes pointages</h3>

      {/* Résumé des heures */}
      <Row className="mt-3 mb-4">
        <Col md={4}>
          <Card className="text-center border-success">
            <Card.Body>
              <Card.Title>⏱️ Temps travaillé</Card.Title>
              <Card.Text><strong>{duree || '--'}</strong></Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-primary">
            <Card.Body>
              <Card.Title>🔁 Heures supp.</Card.Title>
              <Card.Text className={heuresSupp > 0 ? 'text-success' : 'text-muted'}>
                {heuresSupp > 0 ? `${Math.floor(heuresSupp / 60)}h${heuresSupp % 60}` : 'Aucune'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-warning">
            <Card.Body>
              <Card.Title>📤 Heures à récupérer</Card.Title>
              <Card.Text className={heuresARecup > 0 ? 'text-danger' : 'text-muted'}>
                {heuresARecup > 0 ? `${Math.floor(heuresARecup / 60)}h${heuresARecup % 60}` : 'OK'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Formulaire d’ajout */}
      <Card className="p-3 shadow-sm">
        <h5>➕ Ajouter un pointage</h5>
        {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
        {erreur && <Alert variant="danger" onClose={() => setErreur('')} dismissible>{erreur}</Alert>}

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
              ➕ Valider
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Historique */}
      <h5 className="mt-5 d-flex justify-content-between align-items-center">
        📋 Historique
        <Button size="sm" variant="outline-secondary" onClick={() => setTriAsc(!triAsc)}>
          Trier {triAsc ? '🔽' : '🔼'}
        </Button>
      </h5>

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
    </Container>
  );
};

export default Pointages;
