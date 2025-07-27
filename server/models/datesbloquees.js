'use strict';
const { Model, DataTypes } = require('sequelize');

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
      allowNull: true
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
