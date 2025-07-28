import React from 'react';
import { Container } from 'react-bootstrap';

const ConfidentialitePage = () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <h1 className="mb-4 text-center">Politique de confidentialité</h1>

        <p>
          Cette politique de confidentialité décrit comment <strong>TimeZone 🕒</strong> collecte, utilise et protège vos données personnelles.
        </p>

        <h4>1. Données collectées</h4>
        <p>
          Nous collectons uniquement les données nécessaires à l’utilisation de la plateforme : nom, prénom, adresse e-mail, rôle, heures de pointage, congés, etc.
        </p>

        <h4>2. Finalité de la collecte</h4>
        <p>
          Les données sont utilisées pour :
        </p>
        <ul>
          <li>Gérer les congés et pointages</li>
          <li>Assurer le bon fonctionnement de l'application</li>
          <li>Communiquer avec les utilisateurs</li>
        </ul>

        <h4>3. Conservation des données</h4>
        <p>
          Les données sont conservées tant que votre compte est actif ou selon les obligations légales.
        </p>

        <h4>4. Sécurité</h4>
        <p>
          Vos données sont protégées par des mesures techniques (chiffrement, sécurisation des accès) et organisationnelles.
        </p>

        <h4>5. Partage des données</h4>
        <p>
          Aucune donnée n’est vendue ni partagée à des tiers, sauf obligation légale ou accord explicite de votre part.
        </p>

        <h4>6. Vos droits</h4>
        <p>
          Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@timezone.app">contact@timezone.app</a>.
        </p>

        <h4>7. Cookies</h4>
        <p>
          Nous n’utilisons actuellement aucun cookie publicitaire ou de suivi tiers.
        </p>

        <p className="text-muted mt-4 small">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </Container>
    </div>
  );
};

export default ConfidentialitePage;
