const { Op } = require('sequelize');
const { HeuresSupp, Pointage, User } = require('../models');

const HEURES_NORMALES = 420;

const creerHeuresSupp = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const debut = new Date(`${date}T00:00:00`);
    const fin = new Date(`${date}T23:59:59`);

    const pointages = await Pointage.findAll({
      where: { userId, horodatage: { [Op.between]: [debut, fin] } },
      order: [['horodatage', 'ASC']]
    });

    let totalMs = 0;
    let start = null;
    for (const p of pointages) {
      if (p.type === 'entree' || p.type === 'reprise') start = new Date(p.horodatage);
      if ((p.type === 'pause' || p.type === 'sortie') && start) {
        totalMs += new Date(p.horodatage) - start;
        start = null;
      }
    }

    const minutes = Math.floor(totalMs / 1000 / 60);
    const heures = minutes - HEURES_NORMALES;

    const [record, created] = await HeuresSupp.findOrCreate({
      where: { userId, date },
      defaults: {
        heures: heures,
        recuperee: false
      }
    });

    if (!created) await record.update({ heures });

    res.status(200).json({ message: created ? 'Ajouté' : 'Mis à jour', data: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMesHeuresSupp = async (req, res) => {
  try {
    const data = await HeuresSupp.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllHeuresSupp = async (req, res) => {
  try {
    const liste = await HeuresSupp.findAll({
      include: {
        model: User,
        as: 'User',
        attributes: ['nom', 'email'] // ce que tu veux afficher
      },
      order: [['date', 'DESC']]
    });

    res.json(liste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const majHeuresSupp = async (req, res) => {
  try {
    const { id } = req.params;
    const { heures, recuperee } = req.body;

    const record = await HeuresSupp.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Introuvable' });

    await record.update({ heures, recuperee });
    res.json({ message: 'Mis à jour', data: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
  creerHeuresSupp,
  getMesHeuresSupp,
  getAllHeuresSupp,
  majHeuresSupp,
  supprimerHeuresSupp
};
