import React from 'react';
import { Container } from 'react-bootstrap';

const MentionsLegalesPage = () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <h1 className="mb-4 text-center">📘 Mentions légales</h1>

        <h4>1. Éditeur du site</h4>
        <p>
          <strong>TimeZone 🕒</strong><br />
          Application de gestion de congés et pointages<br />
          Éditée par : Miradji Ladhidhou<br />
          Adresse : La Réunion<br />
          Email : <a href="mailto:contact@timezone.app">contact@timezone.app</a><br />
        </p>

        <h4>2. Hébergement</h4>
        <p>
          Le site est hébergé par :<br />
          ...<br />
          Adresse : ...<br />
          Téléphone : ...
        </p>

        <h4>3. Propriété intellectuelle</h4>
        <p>
          L’ensemble du contenu du site (textes, logos, interfaces, code, etc.) est la propriété exclusive de TimeZone, sauf mention contraire.
          Toute reproduction ou utilisation non autorisée est interdite.
        </p>

        <h4>4. Responsabilité</h4>
        <p>
          TimeZone ne peut être tenu responsable en cas de mauvaise utilisation du service ou d’interruption due à un problème technique indépendant de sa volonté.
        </p>

        <h4>5. Données personnelles</h4>
        <p>
          Les données collectées sont traitées conformément à la <a href="/confidentialite">politique de confidentialité</a> et au RGPD.
        </p>

        <h4>6. Contact</h4>
        <p>
          Pour toute question ou demande : <a href="mailto:contact@timezone.app">contact@timezone.app</a>
        </p>

        <p className="text-muted mt-4 small">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </Container>
    </div>
  );
};

export default MentionsLegalesPage;
