const { Op } = require('sequelize');
const { Pointage } = require('../models');

const CRENEAU_AUTORISE = {
  null: ['entree'],
  entree: ['pause', 'sortie'],
  pause: ['reprise'],
  reprise: ['pause', 'sortie'],
  sortie: ['entree']
};

const creerPointage = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    const dernier = await Pointage.findOne({
      where: { userId },
      order: [['horodatage', 'DESC']]
    });

    const dernierType = dernier ? dernier.type : null;
    const suivantsPossibles = CRENEAU_AUTORISE[dernierType];

    if (!suivantsPossibles.includes(type)) {
      return res.status(400).json({
        message: `Pointage "${type}" invalide après "${dernierType ?? 'aucun'}". Prochaine action autorisée : ${suivantsPossibles.join(' ou ')}`
      });
    }

    const pointage = await Pointage.create({ userId, type });
    res.status(201).json({ message: 'Pointage enregistré', pointage });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const listerMesPointages = async (req, res) => {
  const userId = req.user.id;

  try {
    const pointages = await Pointage.findAll({
      where: { userId },
      order: [['horodatage', 'DESC']]
    });
    res.json(pointages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const modifierPointage = async (req, res) => {
  try {
    const pointage = await Pointage.findByPk(req.params.id);
    if (!pointage) return res.status(404).json({ message: 'Pointage introuvable' });

    const { type, horodatage } = req.body;
    await pointage.update({ type, horodatage });
    res.json({ message: 'Pointage mis à jour', pointage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const supprimerPointage = async (req, res) => {
  try {
    const pointage = await Pointage.findByPk(req.params.id);
    if (!pointage) return res.status(404).json({ message: 'Pointage introuvable' });

    await pointage.destroy();
    res.json({ message: 'Pointage supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listerPointagesDuJour = async (req, res) => {
  try {
    const userId = req.user.id;

    // Début et fin du jour
    const today = new Date();
    const debut = new Date(today.setHours(0, 0, 0, 0));
    const fin = new Date(today.setHours(23, 59, 59, 999));

    const pointages = await Pointage.findAll({
      where: {
        userId,
        horodatage: {
          [Op.between]: [debut, fin]
        }
      },
      order: [['horodatage', 'ASC']]
    });

    res.json({ pointages });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const calculerHeuresTravaillees = async (req, res) => {
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
      order: [['horodatage', 'ASC']]
    });

    let totalMs = 0;
    let sessionStart = null;

    for (const p of pointages) {
      if (p.type === 'entree' || p.type === 'reprise') {
        sessionStart = new Date(p.horodatage);
      }

      if ((p.type === 'pause' || p.type === 'sortie') && sessionStart) {
        const sessionEnd = new Date(p.horodatage);
        totalMs += sessionEnd - sessionStart;
        sessionStart = null;
      }
    }

    const heures = Math.floor(totalMs / 1000 / 60 / 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);

    res.json({
      dureeTravail: `${heures}h${minutes < 10 ? '0' : ''}${minutes}`,
      totalMinutes: Math.floor(totalMs / 1000 / 60),
      totalMillisecondes: totalMs,
      pointages
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = { creerPointage,  listerMesPointages: async (req, res) => {
    const pointages = await Pointage.findAll({ where: { userId: req.user.id } });
    res.json(pointages);
  }, modifierPointage, supprimerPointage, listerPointagesDuJour, calculerHeuresTravaillees };
