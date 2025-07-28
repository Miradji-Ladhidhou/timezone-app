// CongesRouter.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CongeEmploye from './CongeEmploye';
import CongeGestion from './CongeGestion';

const CongesRouter = () => {
  const { user } = useAuth();

  if (!user) return <p>Chargement...</p>;

  if (user.role === 'admin' || user.role === 'secretaire') {
    return <CongeGestion />;
  }

  return <CongeEmploye />;
};

export default CongesRouter;
