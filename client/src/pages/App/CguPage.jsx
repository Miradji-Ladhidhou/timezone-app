import React from 'react';
import { Container, Card } from 'react-bootstrap';

const CguPage = () => {
  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Conditions Générales d'Utilisation</h2>

      <Card className="p-4 shadow-sm border-0">
        <p>
          Bienvenue sur <strong>TimeZone 🕒</strong>. En utilisant cette plateforme, vous acceptez pleinement les conditions générales ci-dessous.
        </p>

        <h5 className="mt-4">1. Objet</h5>
        <p>
          TimeZone est une application dédiée à la gestion des congés, des pointages horaires et des dates bloquées en entreprise.
        </p>

        <h5 className="mt-4">2. Accès au service</h5>
        <p>
          L’accès à certaines fonctionnalités nécessite une authentification sécurisée. Les utilisateurs s’engagent à fournir des informations exactes et à jour.
        </p>

        <h5 className="mt-4">3. Responsabilités</h5>
        <p>
          Chaque utilisateur est responsable de l’usage de son compte. Toute tentative d’intrusion ou de fraude entraînera la suspension immédiate.
        </p>

        <h5 className="mt-4">4. Données personnelles</h5>
        <p>
          Vos données sont utilisées uniquement dans le cadre de TimeZone. Aucune donnée n’est vendue ni partagée sans votre consentement.
        </p>

        <h5 className="mt-4">5. Modifications des CGU</h5>
        <p>
          Les présentes CGU peuvent être modifiées à tout moment. En cas de mise à jour, un message d’information vous sera présenté.
        </p>

        <h5 className="mt-4">6. Contact</h5>
        <p>
          Pour toute question, contactez-nous à <a href="mailto:contact@timezone.app">contact@timezone.app</a>.
        </p>

        <p className="text-muted text-end small mt-4">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </Card>
    </Container>
  );
};

export default CguPage;
