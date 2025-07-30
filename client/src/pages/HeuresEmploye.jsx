import React, { useEffect, useState } from 'react';
import {
  Container, Table, Button, Badge, Row, Col, Card, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const HeuresEmploye = () => {
  const { token } = useAuth();
  const [heures, setHeures] = useState([]);
  const [triAsc, setTriAsc] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/heures-supp/mes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHeures(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [token]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sorted = [...heures].sort((a, b) =>
    triAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
  );

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(heures.length / pageSize);

  const exporterCSV = () => {
    const lignes = [
      ['Date', 'Heures normales', 'Travaillées', 'Supplémentaires', 'À récupérer', 'Statut'],
      ...heures.map(h => [
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
    link.setAttribute('href', url);
    link.setAttribute('download', 'heures_supplementaires.csv');
    link.click();
  };

  return (
    <Container className="mt-4">
      <h3>🕒 Mes heures supplémentaires</h3>

      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <Button variant="outline-secondary" size="sm" onClick={() => setTriAsc(!triAsc)}>
          Trier par date {triAsc ? '🔼' : '🔽'}
        </Button>
        <Button size="sm" variant="outline-success" onClick={exporterCSV}>
          📁 Exporter CSV
        </Button>
      </div>

      {!isMobile ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heures normales</th>
                <th>Travaillées</th>
                <th>Supplémentaires</th>
                <th>À récupérer</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(h => (
                <tr key={h.id}>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{Math.floor(h.heures_normales / 60)}h</td>
                  <td>{Math.floor(h.heures_travaillees / 60)}h</td>
                  <td>{Math.floor(h.heures_supp / 60)}h</td>
                  <td>{Math.floor(h.heures_a_recuperer / 60)}h</td>
                  <td>
                    <Badge bg={h.statut === 'recuperee' ? 'success' : 'warning'}>
                      {h.statut === 'recuperee' ? 'Récupérée' : 'Non récupérée'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {[...Array(totalPages).keys()].map(n => (
              <Pagination.Item
                key={n + 1}
                active={n + 1 === page}
                onClick={() => setPage(n + 1)}
              >
                {n + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      ) : (
        <Row>
          {paginated.map(h => (
            <Col xs={12} key={h.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{new Date(h.date).toLocaleDateString()}</Card.Title>
                  <Card.Text>
                    <strong>Normales :</strong> {Math.floor(h.heures_normales / 60)}h<br />
                    <strong>Travaillées :</strong> {Math.floor(h.heures_travaillees / 60)}h<br />
                    <strong>Supplémentaires :</strong> {Math.floor(h.heures_supp / 60)}h<br />
                    <strong>À récupérer :</strong> {Math.floor(h.heures_a_recuperer / 60)}h<br />
                    <strong>Statut :</strong>{' '}
                    <Badge bg={h.statut === 'recuperee' ? 'success' : 'warning'}>
                      {h.statut === 'recuperee' ? 'Récupérée' : 'Non récupérée'}
                    </Badge>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <Pagination className="justify-content-center">
            {[...Array(totalPages).keys()].map(n => (
              <Pagination.Item
                key={n + 1}
                active={n + 1 === page}
                onClick={() => setPage(n + 1)}
              >
                {n + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Row>
      )}
    </Container>
  );
};

export default HeuresEmploye;
