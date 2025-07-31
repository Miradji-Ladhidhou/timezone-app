const { DatesBloquees } = require('../models');

/**
 * @function listerDates
 * @description Récupère toutes les dates bloquées
 * @route GET /api/dates-bloquees
 * @access Admin / Secrétaire / Employé (lecture seule)
 * @returns {Array<Object>} 200 - Liste des dates bloquées
 */
const listerDates = async (req, res) => {
  const dates = await DatesBloquees.findAll();
  res.json(dates);
};

/**
 * @function creerDate
 * @description Crée une nouvelle période bloquée (admin ou secrétaire)
 * @route POST /api/dates-bloquees
 * @access Admin / Secrétaire
 * @param {Object} req.body - Contient dateDebut, dateFin, motif
 * @returns {Object} 201 - Date bloquée créée
 * @returns {Object} 500 - Erreur serveur
 */
const creerDate = async (req, res) => {
  try {
    const { dateDebut, dateFin, motif } = req.body;
    const nouvelle = await DatesBloquees.create({ dateDebut, dateFin, motif });
    res.status(201).json(nouvelle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function mettreAJourDate
 * @description Met à jour une période bloquée existante par son ID
 * @route PUT /api/dates-bloquees/:id
 * @access Admin / Secrétaire
 * @param {Object} req.body - Contient dateDebut, dateFin, motif
 * @returns {Object} 200 - Date bloquée mise à jour
 * @returns {Object} 404 - Date introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const mettreAJourDate = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await DatesBloquees.findByPk(id);
    if (!date) return res.status(404).json({ message: "Date introuvable." });

    const { dateDebut, dateFin, motif } = req.body;
    await date.update({ dateDebut, dateFin, motif });
    res.json(date);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function supprimerDate
 * @description Supprime une période bloquée existante
 * @route DELETE /api/dates-bloquees/:id
 * @access Admin / Secrétaire
 * @returns {Object} 200 - Message de confirmation
 * @returns {Object} 404 - Date introuvable
 * @returns {Object} 500 - Erreur serveur
 */
const supprimerDate = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await DatesBloquees.findByPk(id);
    if (!date) return res.status(404).json({ message: "Date introuvable." });

    await date.destroy();
    res.json({ message: "Date bloquée supprimée." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listerDates,
  creerDate,
  mettreAJourDate,
  supprimerDate
};
