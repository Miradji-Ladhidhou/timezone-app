const { DatesBloquees } = require('../models');

const listerDates = async (req, res) => {
  const dates = await DatesBloquees.findAll();
  res.json(dates);
};

const creerDate = async (req, res) => {
  try {
    const { dateDebut, dateFin, motif } = req.body;
    const nouvelle = await DatesBloquees.create({ dateDebut, dateFin, motif });
    res.status(201).json(nouvelle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
