// src/pages/UsersAdmin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Table, Button, Modal, Form, Row, Col, Card, Alert, Pagination
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const UsersAdmin = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [tri, setTri] = useState({ colonne: 'createdAt', ordre: 'desc' });
  const [page, setPage] = useState(1);
  const parPage = 10;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetch users:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTri = (colonne) => {
    setTri(prev => ({
      colonne,
      ordre: prev.colonne === colonne && prev.ordre === 'asc' ? 'desc' : 'asc'
    }));
  };

  const usersTries = [...users].sort((a, b) => {
    let valA = a[tri.colonne]?.toString().toLowerCase() || '';
    let valB = b[tri.colonne]?.toString().toLowerCase() || '';
    if (tri.colonne === 'createdAt') {
      valA = new Date(a.createdAt);
      valB = new Date(b.createdAt);
    }
    if (valA < valB) return tri.ordre === 'asc' ? -1 : 1;
    if (valA > valB) return tri.ordre === 'asc' ? 1 : -1;
    return 0;
  });

  const indexDebut = (page - 1) * parPage;
  const usersPage = usersTries.slice(indexDebut, indexDebut + parPage);
  const totalPages = Math.ceil(usersTries.length / parPage);

  const pagination = (
    <Pagination className="mt-3 justify-content-center">
      {[...Array(totalPages).keys()].map(num => (
        <Pagination.Item key={num + 1} active={num + 1 === page} onClick={() => setPage(num + 1)}>
          {num + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNom(user.nom);
    setEmail(user.email);
    setRole(user.role);
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${selectedUser.id}`,
        { nom, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur modification:", err);
      setAlert("Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h3>👥 Gestion des utilisateurs</h3>

      {!isMobile ? (
        <>
          <Table bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th onClick={() => handleTri('nom')} style={{ cursor: 'pointer' }}>
                  Nom {tri.colonne === 'nom' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('email')} style={{ cursor: 'pointer' }}>
                  Email {tri.colonne === 'email' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('role')} style={{ cursor: 'pointer' }}>
                  Rôle {tri.colonne === 'role' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleTri('createdAt')} style={{ cursor: 'pointer' }}>
                  Créé le {tri.colonne === 'createdAt' && (tri.ordre === 'asc' ? '▲' : '▼')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersPage.map(u => (
                <tr key={u.id}>
                  <td>{u.nom}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button size="sm" variant="warning" onClick={() => handleEditClick(u)}>Modifier</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => deleteUser(u.id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination}
        </>
      ) : (
        <>
          <Row className="mt-3">
            {usersPage.map(u => (
              <Col xs={12} key={u.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{u.nom}</Card.Title>
                    <Card.Text><strong>Email:</strong> {u.email}</Card.Text>
                    <Card.Text><strong>Rôle:</strong> {u.role}</Card.Text>
                    <Card.Text><strong>Créé le:</strong> {new Date(u.createdAt).toLocaleDateString()}</Card.Text>
                    <Button size="sm" variant="warning" onClick={() => handleEditClick(u)}>Modifier</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => deleteUser(u.id)}>Supprimer</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {pagination}
        </>
      )}

      {/* Modal modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Modifier utilisateur</Modal.Title></Modal.Header>
        <Modal.Body>
          {alert && <Alert variant="danger">{alert}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control value={nom} onChange={e => setNom(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rôle</Form.Label>
              <Form.Select value={role} onChange={e => setRole(e.target.value)}>
                <option value="admin">admin</option>
                <option value="secretaire">secretaire</option>
                <option value="employe">employe</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleUpdateUser}>Enregistrer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UsersAdmin;
