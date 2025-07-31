'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * @typedef {Object} Conge
 * @property {number} userId - ID de l'utilisateur
 * @property {string} type - Type de congé (Congé annuel, RTT, Sans solde, etc.)
 * @property {string} dateDebut - Date de début du congé (YYYY-MM-DD)
 * @property {string} dateFin - Date de fin du congé (YYYY-MM-DD)
 * @property {string} statut - Statut de la demande (en_attente, valide, refuse)
 * @property {string} [motifRefus] - Motif du refus si applicable
 */

module.exports = (sequelize) => {
  class Conge extends Model {}

  Conge.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Congé annuel', 'RTT', 'Sans solde', 'Maladie', 'Congé maternité', 'Congé maternité']]
      }
    },
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
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en_attente',
      validate: {
        isIn: [['en_attente', 'valide', 'refuse']]
      }
    },
    motifRefus: {
      type: DataTypes.TEXT,
      field: 'motif_refus'
    }
  }, {
    sequelize,
    modelName: 'Conge',
    tableName: 'conges',
    underscored: true,
    timestamps: true
  });

  Conge.associate = (models) => {
    /**
     * Association avec le modèle User
     * @memberof Conge
     */
    Conge.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Conge;
};
