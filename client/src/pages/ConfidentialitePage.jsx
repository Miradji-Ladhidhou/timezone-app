import React from 'react';
import { Container, Card } from 'react-bootstrap';

const ConfidentialitePage = () => {
  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Politique de confidentialité</h2>

      <Card className="p-4 shadow-sm border-0">
        <p>
          Cette politique de confidentialité décrit comment <strong>TimeZone 🕒</strong> collecte, utilise et protège vos données personnelles.
        </p>

        <h5 className="mt-4">1. Données collectées</h5>
        <p>
          Nous collectons uniquement les données nécessaires à l’utilisation de la plateforme : nom, prénom, adresse e-mail, rôle, heures de pointage, congés, etc.
        </p>

        <h5 className="mt-4">2. Finalité de la collecte</h5>
        <p>Les données sont utilisées pour :</p>
        <ul>
          <li>Gérer les congés et les pointages</li>
          <li>Assurer le bon fonctionnement de l'application</li>
          <li>Communiquer avec les utilisateurs</li>
        </ul>

        <h5 className="mt-4">3. Conservation des données</h5>
        <p>
          Les données sont conservées tant que votre compte est actif ou selon les obligations légales en vigueur.
        </p>

        <h5 className="mt-4">4. Sécurité</h5>
        <p>
          Vos données sont protégées par des mesures techniques (chiffrement, sécurisation des accès) et organisationnelles strictes.
        </p>

        <h5 className="mt-4">5. Partage des données</h5>
        <p>
          Aucune donnée n’est vendue ni partagée avec des tiers, sauf obligation légale ou accord explicite de votre part.
        </p>

        <h5 className="mt-4">6. Vos droits</h5>
        <p>
          Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression et de portabilité de vos données.
          Pour exercer vos droits, contactez-nous à : <a href="mailto:contact@timezone.app">contact@timezone.app</a>
        </p>

        <h5 className="mt-4">7. Cookies</h5>
        <p>
          Nous n’utilisons actuellement aucun cookie publicitaire ni de suivi tiers.
        </p>

        <p className="text-muted text-end small mt-4">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </Card>
    </Container>
  );
};

export default ConfidentialitePage;
