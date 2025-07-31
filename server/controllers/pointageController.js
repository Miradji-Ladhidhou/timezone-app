const { Pointage, HeuresSupp, User } = require('../models');
const { Op } = require('sequelize');
const { creerHeuresSuppPourUtilisateur } = require('./heuresSuppController');

/**
 * @function creerPointage
 * @description Crée ou met à jour un pointage pour l'utilisateur connecté. Déclenche le calcul des heures supp si type = "sortie".
 * @route POST /api/pointages
 * @access Employé
 * @param {Object} req.body - Contient { type, date, heure }
 * @returns {Object} 200 - Pointage enregistré
 * @returns {Object} 400 - Données manquantes ou type invalide
 * @returns {Object} 500 - Erreur serveur
 */
const creerPointage = async (req, res) => {
  try {
    const { type, date, heure } = req.body;
    const userId = req.user.id;

    if (!type || !date || !heure) {
      return res.status(400).json({ message: 'Données incomplètes (type, date, heure)' });
    }

    const champsValides = ['entree', 'pause', 'reprise', 'sortie'];
    if (!champsValides.includes(type)) {
      return res.status(400).json({ message: 'Type de pointage invalide' });
    }

    let pointage = await Pointage.findOne({ where: { user_id: userId, date } });

    if (pointage) {
      pointage[type] = heure;
      await pointage.save();
    } else {
      const newData = { user_id: userId, date };
      newData[type] = heure;
      pointage = await Pointage.create(newData);
    }

    if (type === 'sortie') {
      await creerHeuresSuppPourUtilisateur(userId, date);
    }

    return res.status(200).json({ message: 'Pointage enregistré', pointage });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * @function listerMesPointages
 * @description Récupère tous les pointages de l’utilisateur connecté
 * @route GET /api/pointages
 * @access Employé
 * @returns {Array<Object>} 200 - Liste des pointages
 * @returns {Object} 500 - Erreur serveur
 */
const listerMesPointages = async (req, res) => {
  try {
    const userId = req.user.id;
    const pointages = await Pointage.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });

    res.json(pointages);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * @function listerTousLesPointages
 * @description Récupère tous les pointages de tous les utilisateurs (admin uniquement)
 * @route GET /api/pointages/tous
 * @access Admin
 * @returns {Array<Object>} 200 - Liste des pointages avec nom/email utilisateur
 * @returns {Object} 500 - Erreur serveur
 */
const listerTousLesPointages = async (req, res) => {
  try {
    const pointages = await Pointage.findAll({
      order: [['date', 'DESC']],
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'nom', 'email']
      }
    });

    res.json(pointages);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * @function calculerHeuresTravaillees
 * @description Calcule les heures travaillées du jour pour l’utilisateur connecté
 * @route GET /api/pointages/duree/aujourdhui
 * @access Employé
 * @returns {Object} 200 - Durée totale en HH:mm + total minutes
 * @returns {Object} 500 - Erreur serveur
 */
const calculerHeuresTravaillees = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const pointage = await Pointage.findOne({
      where: { user_id: userId, date: today }
    });

    if (!pointage) {
      return res.json({ dureeTravail: '0h00', totalMinutes: 0 });
    }

    const { entree, pause, reprise, sortie } = pointage;

    let minutes = 0;

    if (entree && sortie) {
      const entreeDate = new Date(`${today}T${entree}`);
      const sortieDate = new Date(`${today}T${sortie}`);
      minutes = Math.floor((sortieDate - entreeDate) / 60000);
    }

    if (pause && reprise) {
      const pauseDate = new Date(`${today}T${pause}`);
      const repriseDate = new Date(`${today}T${reprise}`);
      const pauseMinutes = Math.floor((repriseDate - pauseDate) / 60000);
      minutes -= pauseMinutes;
    }

    const heures = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return res.json({
      dureeTravail: `${heures}h${mins.toString().padStart(2, '0')}`,
      totalMinutes: minutes
    });

  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/**
 * @function modifierPointage
 * @description Met à jour un pointage existant (admin uniquement)
 * @route PUT /api/pointages/:id
 * @access Admin
 * @param {Object} req.body - Peut contenir entree, pause, reprise, sortie
 * @returns {Object} 200 - Pointage mis à jour
 * @returns {Object} 404 - Pointage introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const modifierPointage = async (req, res) => {
  try {
    const { id } = req.params;
    const { entree, pause, reprise, sortie } = req.body;

    const pointage = await Pointage.findByPk(id);
    if (!pointage) {
      return res.status(404).json({ message: 'Pointage introuvable' });
    }

    pointage.entree = entree ?? pointage.entree;
    pointage.pause = pause ?? pointage.pause;
    pointage.reprise = reprise ?? pointage.reprise;
    pointage.sortie = sortie ?? pointage.sortie;

    await pointage.save();

    res.status(200).json({ message: 'Pointage mis à jour', pointage });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  creerPointage,
  listerMesPointages,
  listerTousLesPointages,
  calculerHeuresTravaillees,
  modifierPointage
};
