// src/pages/HeuresAdmin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Table, Button, Form, Card, Row, Col, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const HeuresAdmin = () => {
  const { token } = useAuth();
  const [heures, setHeures] = useState([]);
  const [page, setPage] = useState(1);
  const parPage = 10;
  const [triAsc, setTriAsc] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  const trier = () => {
    return [...heures].sort((a, b) => {
      return triAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
  };

  const paginer = (data) => {
    const debut = (page - 1) * parPage;
    return data.slice(debut, debut + parPage);
  };

  const handleStatutChange = async (id, value) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/heures-supp/${id}`, { statut: value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHeures();
    } catch (err) {
      console.error(err);
    }
  };

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
      ['Utilisateur', 'Date', 'Normales', 'Travaillées', 'Supplémentaires', 'À récupérer', 'Statut'],
      ...heures.map(h => [
        h.User?.nom || 'Inconnu',
        new Date(h.date).toLocaleDateString(),
        `${Math.floor(h.heures_normales / 60)}h`,
        `${Math.floor(h.heures_travaillees / 60)}h`,
        `${Math.floor(h.heures_supp / 60)}h`,
        `${Math.floor(h.heures_a_recuperer / 60)}h`,
        h.statut
      ])
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

  const pagination = (
    <Pagination className="mt-3 justify-content-center">
      {[...Array(totalPages).keys()].map(num => (
        <Pagination.Item key={num + 1} active={num + 1 === page} onClick={() => setPage(num + 1)}>
          {num + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  return (
    <Container className="mt-4">
      <h3>🛠️ Gestion des heures supplémentaires</h3>

      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <Button size="sm" variant="outline-success" onClick={exporterCSV}>
          📁 Exporter CSV
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={() => setTriAsc(!triAsc)}>
          Trier par date {triAsc ? '🔼' : '🔽'}
        </Button>
      </div>

      {!isMobile ? (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Date</th>
                <th>Normales</th>
                <th>Travaillées</th>
                <th>Supplémentaires</th>
                <th>À récupérer</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {heuresPage.map(h => (
                <tr key={h.id}>
                  <td>{h.User?.nom || 'Utilisateur inconnu'}</td>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{Math.floor(h.heures_normales / 60)}h</td>
                  <td>{Math.floor(h.heures_travaillees / 60)}h</td>
                  <td>{Math.floor(h.heures_supp / 60)}h</td>
                  <td>{Math.floor(h.heures_a_recuperer / 60)}h</td>
                  <td>
                    <Form.Select
                      value={h.statut}
                      onChange={(e) => handleStatutChange(h.id, e.target.value)}
                      size="sm"
                    >
                      <option value="non_recuperee">Non récupérée</option>
                      <option value="recuperee">Récupérée</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(h.id)}>🗑️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination}
        </>
      ) : (
        <Row>
          {heuresPage.map(h => (
            <Col xs={12} key={h.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{h.User?.nom || 'Utilisateur inconnu'}</Card.Title>
                  <Card.Text><strong>Date :</strong> {new Date(h.date).toLocaleDateString()}</Card.Text>
                  <Card.Text><strong>Normales :</strong> {Math.floor(h.heures_normales / 60)}h</Card.Text>
                  <Card.Text><strong>Travaillées :</strong> {Math.floor(h.heures_travaillees / 60)}h</Card.Text>
                  <Card.Text><strong>Supplémentaires :</strong> {Math.floor(h.heures_supp / 60)}h</Card.Text>
                  <Card.Text><strong>À récupérer :</strong> {Math.floor(h.heures_a_recuperer / 60)}h</Card.Text>
                  <Card.Text>
                    <strong>Statut :</strong>
                    <Form.Select
                      value={h.statut}
                      onChange={(e) => handleStatutChange(h.id, e.target.value)}
                      size="sm"
                    >
                      <option value="non_recuperee">Non récupérée</option>
                      <option value="recuperee">Récupérée</option>
                    </Form.Select>
                  </Card.Text>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(h.id)}>🗑️</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <Col xs={12}>{pagination}</Col>
        </Row>
      )}
    </Container>
  );
};

export default HeuresAdmin;
