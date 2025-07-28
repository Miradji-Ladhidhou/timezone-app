import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Pointages = () => {
  const { token } = useAuth();
  const [pointages, setPointages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('entree');
  const [error, setError] = useState(null);

  const fetchPointages = React.useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/pointages/mes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPointages(res.data);
    } catch (err) {
      console.error('Erreur fetch pointages:', err);
    }
  }, [token]);

  const handleAddPointage = async () => {
    try {
      setError(null);
      await axios.post(`${process.env.REACT_APP_API_URL}/pointages`, {
        type,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setType('entree');
      setShowModal(false);
      fetchPointages();
    } catch (err) {
      console.error('Erreur ajout pointage:', err);
      setError("Impossible d'ajouter le pointage. Vérifiez la cohérence ou réessayez plus tard.");
    }
  };

  useEffect(() => {
    fetchPointages();
  }, [fetchPointages]);

  const formaterHeure = (horodatage) => {
    const date = new Date(horodatage);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formaterDate = (horodatage) => {
    const date = new Date(horodatage);
    return date.toLocaleDateString();
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Historique de mes pointages</Card.Title>
              <Card.Text>Visualisez toutes vos actions de pointage.</Card.Text>
              <Button variant="success" onClick={() => setShowModal(true)}>➕ Ajouter un pointage</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {pointages.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center">Aucun pointage enregistré</td>
            </tr>
          )}
          {pointages.map((p) => (
            <tr key={p.id}>
              <td>{formaterDate(p.horodatage)}</td>
              <td>{formaterHeure(p.horodatage)}</td>
              <td>{p.type}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un pointage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Type de pointage</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="entree">Entrée</option>
                <option value="pause">Pause</option>
                <option value="reprise">Reprise</option>
                <option value="sortie">Sortie</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAddPointage}>Valider</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Pointages;
