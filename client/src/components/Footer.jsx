import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <Container>
        <Row className="mb-3">
          <Col md={6}>
            <h5>TimeZone 🕒</h5>
            <p className="small">
              Plateforme intuitive pour gérer vos congés, heures de travail et absences.
            </p>
          </Col>
          <Col md={3}>
            <h6>Navigation</h6>
            <ul className="list-unstyled small">
              <li>
                <Link to="/" className="text-white text-decoration-none">Accueil</Link>
              </li>
              <li>
                <Link to="/about" className="text-white text-decoration-none">À propos</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Informations</h6>
            <ul className="list-unstyled small">
              <li>
                <Link to="/cgu" className="text-white text-decoration-none">CGU</Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-white text-decoration-none">Confidentialité</Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-white text-decoration-none">Mentions légales</Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <small>&copy; {new Date().getFullYear()} TimeZone. Tous droits réservés.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
