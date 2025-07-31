const { Op } = require('sequelize');
const { HeuresSupp, Pointage, User } = require('../models');

const HEURES_NORMALES_MIN = 420; // 7h

/**
 * @function creerHeuresSuppPourUtilisateur
 * @description Calcule et enregistre les heures supplémentaires d’un utilisateur pour une date donnée
 * @param {number} userId - ID de l'utilisateur
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {Promise<void>} - Met à jour ou crée une ligne dans la table `heures_supp`
 */
const creerHeuresSuppPourUtilisateur = async (userId, date) => {
  try {
    const pointage = await Pointage.findOne({ where: { userId, date } });

    if (!pointage || !pointage.entree || !pointage.sortie) return;

    const entree = new Date(`${date}T${pointage.entree}`);
    const sortie = new Date(`${date}T${pointage.sortie}`);
    let minutes = Math.floor((sortie - entree) / 60000);

    if (pointage.pause && pointage.reprise) {
      const pause = new Date(`${date}T${pointage.pause}`);
      const reprise = new Date(`${date}T${pointage.reprise}`);
      minutes -= Math.floor((reprise - pause) / 60000);
    }

    const heuresSupp = Math.max(0, minutes - HEURES_NORMALES_MIN);
    const heuresARecup = Math.max(0, HEURES_NORMALES_MIN - minutes);
    const heuresRecuperees = 0;

    const [record, created] = await HeuresSupp.findOrCreate({
      where: { userId, date },
      defaults: {
        heures_normales: HEURES_NORMALES_MIN,
        heures_travaillees: minutes,
        heures_supp: heuresSupp,
        heures_a_recuperer: heuresARecup,
        heures_recuperees: heuresRecuperees,
        statut: 'non_recuperee'
      }
    });

    if (!created) {
      await record.update({
        heures_travaillees: minutes,
        heures_supp: heuresSupp,
        heures_a_recuperer: heuresARecup,
        heures_recuperees: heuresRecuperees,
        statut: 'non_recuperee',
        updated_at: new Date()
      });
    }
  } catch (err) {
    throw err;
  }
};

/**
 * @function getMesHeuresSupp
 * @description Récupère les heures supplémentaires de l’utilisateur connecté (avec report auto des heures J-1 si nécessaire)
 * @route GET /api/heures-supp/mes
 * @access Employé
 * @returns {Array<Object>} 200 - Liste des heures supplémentaires
 * @returns {Object} 500 - Erreur serveur
 */
const getMesHeuresSupp = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const heuresHier = await HeuresSupp.findOne({
      where: {
        userId,
        date: yesterday,
        heures_restantes: { [Op.gt]: 0 },
        statut: 'non_recuperee'
      }
    });

    const dejaAujourdHui = await HeuresSupp.findOne({
      where: { userId, date: today }
    });

    if (heuresHier && !dejaAujourdHui) {
      await HeuresSupp.create({
        userId,
        date: today,
        heures_normales: 420,
        heures_travaillees: 0,
        heures_supp: 0,
        heures_a_recuperer: heuresHier.heures_restantes,
        heures_recuperees: 0,
        heures_restantes: heuresHier.heures_restantes,
        statut: 'non_recuperee'
      });
    }

    const data = await HeuresSupp.findAll({
      where: { userId },
      order: [['date', 'DESC']]
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getAllHeuresSupp
 * @description Récupère toutes les lignes d’heures supplémentaires avec l’utilisateur associé
 * @route GET /api/heures-supp
 * @access Admin
 * @returns {Array<Object>} 200 - Liste complète des heures supplémentaires
 * @returns {Object} 500 - Erreur serveur
 */
const getAllHeuresSupp = async (req, res) => {
  try {
    const liste = await HeuresSupp.findAll({
      include: {
        model: User,
        as: 'User',
        attributes: ['nom', 'email']
      },
      order: [['date', 'DESC']]
    });

    res.json(liste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function majHeuresSupp
 * @description Met à jour les heures récupérées ou le statut pour une ligne spécifique
 * @route PUT /api/heures-supp/:id
 * @access Admin
 * @param {Object} req.body - Peut contenir heures_recuperees et/ou statut
 * @returns {Object} 200 - Ligne mise à jour
 * @returns {Object} 404 - Ligne introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const majHeuresSupp = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const instance = await HeuresSupp.findByPk(id);
    if (!instance) {
      return res.status(404).json({ message: "Heures supp introuvables" });
    }

    if (body.heures_recuperees !== undefined) {
      instance.heures_recuperees = body.heures_recuperees;
      if (body.heures_recuperees >= instance.heures_a_recuperer) {
        instance.statut = 'recuperee';
      }
    }

    if (body.statut !== undefined) {
      instance.statut = body.statut;
    }

    await instance.save();

    res.json(instance);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/**
 * @function supprimerHeuresSupp
 * @description Supprime une ligne d’heures supplémentaires par ID
 * @route DELETE /api/heures-supp/:id
 * @access Admin
 * @returns {Object} 200 - Message de confirmation
 * @returns {Object} 404 - Introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const supprimerHeuresSupp = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await HeuresSupp.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Introuvable' });

    await record.destroy();
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  creerHeuresSuppPourUtilisateur,
  getMesHeuresSupp,
  getAllHeuresSupp,
  majHeuresSupp,
  supprimerHeuresSupp
};
