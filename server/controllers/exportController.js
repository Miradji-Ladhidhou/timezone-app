const { Pointage, User } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

/**
 * @function exportPointagesCSV
 * @description Exporte les pointages du jour de l'utilisateur connecté au format CSV
 * @route GET /api/pointages/export
 * @access Employé
 * @returns {CSV} 200 - Fichier CSV des pointages du jour
 * @returns {Object} 500 - Erreur serveur
 */
const exportPointagesCSV = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const debut = new Date(today.setHours(0, 0, 0, 0));
    const fin = new Date(today.setHours(23, 59, 59, 999));

    const pointages = await Pointage.findAll({
      where: {
        userId,
        horodatage: { [Op.between]: [debut, fin] }
      },
      order: [['horodatage', 'ASC']],
      include: [{ model: User, as: 'User', attributes: ['nom', 'email'] }]
    });

    const json = pointages.map(p => ({
      nom: p.User.nom,
      email: p.User.email,
      type: p.type,
      horodatage: p.horodatage
    }));

    const parser = new Parser();
    const csv = parser.parse(json);

    res.header('Content-Type', 'text/csv');
    res.attachment('pointages_aujourdhui.csv');
    res.send(csv);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { exportPointagesCSV };
