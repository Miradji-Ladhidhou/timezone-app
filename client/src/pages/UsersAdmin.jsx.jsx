import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const UsersAdmin = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employe');
  const [password, setPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
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
      console.error("Erreur suppression utilisateur:", err);
    }
  };

  const handleAddUser = async () => {
    if (!nom || !email || !password) return setAlert("Tous les champs sont obligatoires.");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
        nom, email, password, role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNom(''); setEmail(''); setPassword(''); setRole('employe');
      setShowModal(false); setAlert('');
      fetchUsers();
    } catch (err) {
      console.error("Erreur création utilisateur:", err);
      setAlert("Erreur lors de la création.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="mt-4">
      <h3>👥 Gestion des utilisateurs</h3>

      <Button className="mb-3" variant="primary" onClick={() => setShowModal(true)}>
        ➕ Ajouter un utilisateur
      </Button>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.nom}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.id !== user?.id && (
                  <Button variant="outline-danger" size="sm" onClick={() => deleteUser(u.id)}>
                    🗑️ Supprimer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal ajout */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Ajouter un utilisateur</Modal.Title></Modal.Header>
        <Modal.Body>
          {alert && <Alert variant="danger">{alert}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control value={nom} onChange={(e) => setNom(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rôle</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="employe">Employé</option>
                <option value="secretaire">Secrétaire</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAddUser}>Ajouter</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UsersAdmin;
