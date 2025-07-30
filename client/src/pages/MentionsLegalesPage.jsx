import React from 'react';
import { Container, Card } from 'react-bootstrap';

const MentionsLegalesPage = () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <h1 className="text-center mb-4">📘 Mentions légales</h1>

        <Card className="p-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="fw-bold">1. Éditeur du site</h5>
            <p>
              <strong>TimeZone 🕒</strong><br />
              Application de gestion de congés et pointages<br />
              Éditée par : Miradji Ladhidhou<br />
              Adresse : La Réunion<br />
              Email : <a href="mailto:contact@timezone.app">contact@timezone.app</a>
            </p>

            <h5 className="fw-bold mt-4">2. Hébergement</h5>
            <p>
              Le site est hébergé par :<br />
              ...<br />
              Adresse : ...<br />
              Téléphone : ...
            </p>

            <h5 className="fw-bold mt-4">3. Propriété intellectuelle</h5>
            <p>
              L’ensemble du contenu du site (textes, logos, interfaces, code, etc.) est la propriété exclusive de TimeZone, sauf mention contraire.
              Toute reproduction ou utilisation non autorisée est interdite.
            </p>

            <h5 className="fw-bold mt-4">4. Responsabilité</h5>
            <p>
              TimeZone ne peut être tenu responsable en cas de mauvaise utilisation du service ou d’interruption due à un problème technique indépendant de sa volonté.
            </p>

            <h5 className="fw-bold mt-4">5. Données personnelles</h5>
            <p>
              Les données collectées sont traitées conformément à la <a href="/confidentialite">politique de confidentialité</a> et au RGPD.
            </p>

            <h5 className="fw-bold mt-4">6. Contact</h5>
            <p>
              Pour toute question ou demande : <a href="mailto:contact@timezone.app">contact@timezone.app</a>
            </p>

            <p className="text-muted mt-4 small">
              Dernière mise à jour : {new Date().toLocaleDateString()}
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default MentionsLegalesPage;
