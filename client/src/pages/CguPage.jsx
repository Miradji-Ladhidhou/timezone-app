import React from 'react';
import { Container } from 'react-bootstrap';

const CguPage = () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <h1 className="mb-4 text-center">Conditions Générales d'Utilisation</h1>

        <p>
          Bienvenue sur <strong>TimeZone 🕒</strong>. En utilisant ce site, vous acceptez pleinement les conditions générales ci-dessous.
        </p>

        <h4>1. Objet</h4>
        <p>
          TimeZone est une plateforme dédiée à la gestion des congés, pointages et dates bloquées en entreprise.
        </p>

        <h4>2. Accès au service</h4>
        <p>
          L’accès à certaines fonctionnalités nécessite une authentification. Les utilisateurs s’engagent à fournir des informations exactes et à jour.
        </p>

        <h4>3. Responsabilités</h4>
        <p>
          Chaque utilisateur est responsable de l’utilisation de son compte. Toute tentative d’intrusion, de fraude ou d’usage abusif entraînera la suspension immédiate du compte.
        </p>

        <h4>4. Données personnelles</h4>
        <p>
          Les données collectées sont utilisées uniquement dans le cadre de TimeZone. Aucune donnée ne sera vendue ou partagée sans votre consentement.
        </p>

        <h4>5. Modifications des CGU</h4>
        <p>
          Les présentes CGU peuvent être modifiées à tout moment. En cas de mise à jour, vous serez informé lors de votre prochaine connexion.
        </p>

        <h4>6. Contact</h4>
        <p>
          Pour toute question concernant ces CGU, veuillez nous contacter à <a href="mailto:contact@timezone.app">contact@timezone.app</a>.
        </p>

        <p className="text-muted mt-4 small">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </Container>
    </div>
  );
};

export default CguPage;
