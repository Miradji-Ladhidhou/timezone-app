import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Table, Button, Form, Alert, Card, Row, Col, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const GestionPointage = () => {
  const { token } = useAuth();
  const [pointages, setPointages] = useState([]);
  const [editingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [triAsc, setTriAsc] = useState(false);
  const [page, setPage] = useState(1);
  const lignesParPage = 10;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPointages = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/pointages/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPointages(res.data);
    } catch (err) {
      console.error('Erreur fetch pointages', err);
    }
  }, [token]);

  useEffect(() => {
    fetchPointages();
  }, [fetchPointages]);

  const formaterDate = (d) => d.split('-').reverse().join('/');

  const trier = () => {
    return [...pointages].sort((a, b) => {
      return triAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
  };

  const paginer = (data) => {
    const debut = (page - 1) * lignesParPage;
    return data.slice(debut, debut + lignesParPage);
  };

  const totalPages = Math.ceil(pointages.length / lignesParPage);

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
      <h3>Gestion des pointages</h3>
      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      {erreur && <Alert variant="danger" onClose={() => setErreur('')} dismissible>{erreur}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" onClick={() => setTriAsc(!triAsc)}>
          Trier par date {triAsc ? '▲' : '▼'}
        </Button>
      </div>

      {!isMobile ? (
        <>
          <Table responsive bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employé</th>
                <th>Entrée</th>
                <th>Pause</th>
                <th>Reprise</th>
                <th>Sortie</th>
              </tr>
            </thead>
            <tbody>
              {paginer(trier()).map(p => (
                <tr key={p.id}>
                  <td>{formaterDate(p.date)}</td>
                  <td>{p.user?.nom || 'Utilisateur inconnu'}</td>
                  {['entree', 'pause', 'reprise', 'sortie'].map(champ => (
                    <td key={champ}>
                      {editingId === p.id ? (
                        <Form.Control
                          type="time"
                          value={editedData[champ] || ''}
                          onChange={(e) => setEditedData({ ...editedData, [champ]: e.target.value })}
                        />
                      ) : (
                        p[champ] || '--'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination}
        </>
      ) : (
        <>
          <Row className="mt-3">
            {paginer(trier()).map(p => (
              <Col xs={12} key={p.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{formaterDate(p.date)}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{p.user?.nom || p.user?.email}</Card.Subtitle>
                    {['entree', 'pause', 'reprise', 'sortie'].map(champ => (
                      <p key={champ}>
                        <strong>{champ.charAt(0).toUpperCase() + champ.slice(1)}:</strong>{' '}
                        {editingId === p.id ? (
                          <Form.Control
                            type="time"
                            value={editedData[champ] || ''}
                            onChange={(e) => setEditedData({ ...editedData, [champ]: e.target.value })}
                          />
                        ) : (
                          p[champ] || '--'
                        )}
                      </p>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {pagination}
        </>
      )}
    </Container>
  );
};

export default GestionPointage;
