'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * @typedef {Object} DatesBloquees
 * @property {string} dateDebut - Date de début de la période bloquée (YYYY-MM-DD)
 * @property {string} dateFin - Date de fin de la période bloquée (YYYY-MM-DD)
 * @property {string} motif - Raison de la période bloquée (ex : fermeture, événement, etc.)
 */

module.exports = (sequelize) => {
  class DatesBloquees extends Model {}

  DatesBloquees.init({
    dateDebut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_debut'
    },
    dateFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_fin'
    },
    motif: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DatesBloquees',
    tableName: 'dates_bloquees',
    underscored: true,
    timestamps: true
  });

  return DatesBloquees;
};
