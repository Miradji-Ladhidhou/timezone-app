const { Op } = require('sequelize');
const { HeuresSupp, Pointage, User } = require('../models');

const HEURES_NORMALES_MIN = 420; // 7h

const creerHeuresSuppPourUtilisateur = async (userId, date) => {
  try {
    const pointage = await Pointage.findOne({ where: { userId, date } });

    if (!pointage || !pointage.entree || !pointage.sortie) {
      console.log('⛔ Données de pointage incomplètes', pointage);
      return;
    }

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
        // ⚠️ NE PAS inclure heures_restantes ici
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

    console.log('✅ Heures supp enregistrées pour', date);
  } catch (err) {
    console.error('❌ Erreur calcul heures supp :', err);
    throw err;
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
        attributes: ['nom', 'email']
      },
      order: [['date', 'DESC']]
    });

    res.json(liste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dans heuresSuppController.js
const majHeuresSupp = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body; // ✅ Ici la correction

    const instance = await HeuresSupp.findByPk(id);
    if (!instance) {
      return res.status(404).json({ message: "Heures supp introuvables" });
    }

    // On autorise uniquement la mise à jour de certaines colonnes
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
    console.error("Erreur majHeuresSupp:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
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
  creerHeuresSuppPourUtilisateur,
  getMesHeuresSupp,
  getAllHeuresSupp,
  majHeuresSupp,
  supprimerHeuresSupp
};
