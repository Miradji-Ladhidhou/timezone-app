'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pointage extends Model {}

  Pointage.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['entree', 'pause', 'reprise', 'sortie']]
      }
    },
    horodatage: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Pointage',
    tableName: 'pointages',
    underscored: true,
    timestamps: true
  });

  return Pointage;
};
