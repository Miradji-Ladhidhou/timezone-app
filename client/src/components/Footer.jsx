import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
              <li><a href="/" className="text-white text-decoration-none">Accueil</a></li>
              <li><a href="/about" className="text-white text-decoration-none">À propos</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Contact</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Informations</h6>
            <ul className="list-unstyled small">
              <li><a href="/cgu" className="text-white text-decoration-none">CGU</a></li>
              <li><a href="/confidentialite" className="text-white text-decoration-none">Confidentialité</a></li>
              <li><a href="/mentions-legales" className="text-white text-decoration-none">Mentions légales</a></li>
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
