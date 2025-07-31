'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * @typedef {Object} Pointage
 * @property {number} user_id - ID de l’utilisateur
 * @property {string} date - Date du pointage (YYYY-MM-DD)
 * @property {string|null} entree - Heure d'entrée (HH:mm)
 * @property {string|null} pause - Heure de début de pause (HH:mm)
 * @property {string|null} reprise - Heure de reprise du travail (HH:mm)
 * @property {string|null} sortie - Heure de sortie (HH:mm)
 */

module.exports = (sequelize) => {
  class Pointage extends Model { }

  Pointage.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    entree: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pause: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reprise: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sortie: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pointages',
    underscored: true
  });

  /**
   * Association avec le modèle User
   * @memberof Pointage
   */
  Pointage.associate = models => {
    Pointage.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Pointage;
};
