const { Conge, DatesBloquees, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @function creerConge
 * @description Crée une demande de congé pour l'utilisateur connecté
 * @route POST /api/conges
 * @access Employé
 * @param {Object} req.body - Contient type, dateDebut, dateFin
 * @returns {Object} 201 - Congé créé (même en cas de chevauchement ou doublon)
 * @returns {Object} 400 - Erreur de validation
 * @returns {Object} 500 - Erreur serveur
 */
const creerConge = async (req, res) => {
  try {
    const { type, dateDebut, dateFin } = req.body;

    if (new Date(dateDebut) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: "Impossible de poser un congé rétroactif." });
    }

    if (new Date(dateDebut) > new Date(dateFin)) {
      return res.status(400).json({
        error: "La date de début ne peut pas être postérieure à la date de fin."
      });
    }

    // Vérifie chevauchement avec dates bloquées
    const datesBloquees = await DatesBloquees.findAll({
      where: {
        [Op.or]: [
          { dateDebut: { [Op.between]: [dateDebut, dateFin] } },
          { dateFin: { [Op.between]: [dateDebut, dateFin] } },
          {
            [Op.and]: [
              { dateDebut: { [Op.lte]: dateDebut } },
              { dateFin: { [Op.gte]: dateFin } }
            ]
          }
        ]
      }
    });
    const chevauchementDatesBloquees = datesBloquees.length > 0;

    // Vérifie doublon de congé
    const doublon = await Conge.findOne({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { dateDebut: { [Op.between]: [dateDebut, dateFin] } },
          { dateFin: { [Op.between]: [dateDebut, dateFin] } },
          {
            [Op.and]: [
              { dateDebut: { [Op.lte]: dateDebut } },
              { dateFin: { [Op.gte]: dateFin } }
            ]
          }
        ]
      }
    });
    const estDoublon = !!doublon;

    // Enregistrement même s'il y a conflit
    const conge = await Conge.create({
      userId: req.user.id,
      type,
      dateDebut,
      dateFin
    });

    let message = "Demande enregistrée avec succès.";
    if (chevauchementDatesBloquees && estDoublon) {
      message = "Demande enregistrée, mais elle chevauche une date bloquée ET un autre congé existant.";
    } else if (chevauchementDatesBloquees) {
      message = "Demande enregistrée, mais elle chevauche une date bloquée.";
    } else if (estDoublon) {
      message = "Demande enregistrée, mais elle chevauche une autre demande de congé.";
    }

    return res.status(201).json({ message, conge });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


/**
 * @function miseAJourStatut
 * @description Met à jour le statut d’un congé (admin ou secrétaire)
 * @route PUT /api/conges/:id
 * @access Admin / Secrétaire
 * @param {Object} req.body - Contient le nouveau statut et éventuellement un motif de refus
 * @returns {Object} 200 - Congé mis à jour
 * @returns {Object} 400 - Motif requis si refus
 * @returns {Object} 404 - Congé introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const miseAJourStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, motifRefus } = req.body;

    const conge = await Conge.findByPk(id);
    if (!conge) return res.status(404).json({ message: 'Congé introuvable' });

    if (statut === 'refuse' && !motifRefus) {
      return res.status(400).json({ message: "Un motif de refus est requis." });
    }

    conge.statut = statut;
    conge.motifRefus = statut === 'refuse' ? motifRefus : null;
    await conge.save();

    res.json(conge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function supprimerConge
 * @description Supprime un congé si son statut est "en_attente"
 * @route DELETE /api/conges/:id
 * @access Admin / Secrétaire
 * @returns {Object} 200 - Message de confirmation
 * @returns {Object} 400 - Impossible de supprimer un congé validé ou refusé
 * @returns {Object} 404 - Congé introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const supprimerConge = async (req, res) => {
  try {
    const { id } = req.params;
    const conge = await Conge.findByPk(id);

    if (!conge) return res.status(404).json({ message: "Congé introuvable." });

    if (conge.statut !== 'en_attente') {
      return res.status(400).json({ message: "Seuls les congés en attente peuvent être supprimés." });
    }

    await conge.destroy();
    res.json({ message: "Congé supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function mesConges
 * @description Récupère tous les congés de l’utilisateur connecté
 * @route GET /api/conges/mes
 * @access Employé
 * @returns {Array<Object>} 200 - Liste de ses congés
 */
const mesConges = async (req, res) => {
  const conges = await Conge.findAll({ where: { userId: req.user.id } });
  res.json(conges);
};

/**
 * @function congesValides
 * @description Récupère tous les congés validés (lecture seule pour tous)
 * @route GET /api/conges/valides
 * @access Public (authentifié)
 * @returns {Array<Object>} 200 - Liste des congés validés
 */
const congesValides = async (req, res) => {
  const conges = await Conge.findAll({
    where: { statut: 'valide' },
    include: { model: User, as: 'user', attributes: ['nom'] }
  });
  res.json(conges);
};

/**
 * @function tousLesConges
 * @description Récupère tous les congés avec utilisateur inclus (admin ou secrétaire)
 * @route GET /api/conges
 * @access Admin / Secrétaire
 * @returns {Array<Object>} 200 - Liste complète des congés
 */
const tousLesConges = async (req, res) => {
  const conges = await Conge.findAll({ include: { model: User, as: 'user' } });
  res.json(conges);
};

module.exports = {
  creerConge,
  miseAJourStatut,
  supprimerConge,
  mesConges,
  congesValides,
  tousLesConges
};
