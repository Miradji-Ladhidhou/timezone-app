const { Conge, DatesBloquees, User } = require('../models');
const { Op } = require('sequelize');

const creerConge = async (req, res) => {
  try {
    const { type, dateDebut, dateFin } = req.body;

    if (new Date(dateDebut) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: "Impossible de poser un congé rétroactif." });
    }

    // Vérifier si le congé chevauche une date bloquée
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
    if (chevauchementDatesBloquees) {
      console.warn("⚠️ Chevauchement avec une date bloquée détecté.");
    }

    // Vérifier les doublons de congé
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
    if (doublon) {
      console.warn("⚠️ Doublon de demande de congé détecté.");
    }
    const conge = await Conge.create({
      userId: req.user.id,
      type,
      dateDebut,
      dateFin
    });

    return res.status(201).json({
      message: chevauchementDatesBloquees
        ? "Demande enregistrée, mais elle chevauche une date bloquée. En attente de validation."
        : "Demande enregistrée avec succès.",
      conge
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


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

const mesConges = async (req, res) => {
  const conges = await Conge.findAll({ where: { userId: req.user.id } });
  res.json(conges);
};

const congesValides = async (req, res) => {
  const conges = await Conge.findAll({
    where: { statut: 'valide' },
    include: { model: User, as: 'user', attributes: ['nom'] }
  });
  res.json(conges);
};

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