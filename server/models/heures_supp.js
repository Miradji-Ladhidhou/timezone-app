'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * @typedef {Object} HeuresSupp
 * @property {number} userId - ID de l'utilisateur
 * @property {string} date - Date de la ligne d’heures supplémentaires (YYYY-MM-DD)
 * @property {number} heures_normales - Durée de travail attendue en minutes (ex : 420 = 7h)
 * @property {number} heures_travaillees - Temps réellement travaillé en minutes
 * @property {number} heures_supp - Heures supplémentaires effectuées (au-delà des normales)
 * @property {number} heures_a_recuperer - Heures à récupérer (si en-dessous des normales)
 * @property {number} heures_recuperees - Heures déjà récupérées
 * @property {number} heures_restantes - Heures restantes à récupérer (auto-calculées)
 * @property {string} statut - Statut de récupération : 'non_recuperee' ou 'recuperee'
 * @property {Date} created_at - Date de création
 * @property {Date} updated_at - Dernière mise à jour
 */

module.exports = (sequelize) => {
  class HeuresSupp extends Model { }

  HeuresSupp.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    heures_normales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 420
    },
    heures_travaillees: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    heures_supp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    heures_a_recuperer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    heures_recuperees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    heures_restantes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      get() {
        return this.getDataValue('heures_restantes');
      },
      set() {
        throw new Error('Impossible de modifier heures_restantes car elle est générée par la base.');
      }
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'non_recuperee',
      validate: {
        isIn: [['non_recuperee', 'recuperee']]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'HeuresSupp',
    tableName: 'heures_supp',
    timestamps: false,
    underscored: true
  });

  /**
   * Association avec le modèle User
   * @memberof HeuresSupp
   */
  HeuresSupp.associate = (models) => {
    HeuresSupp.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User'
    });
  };

  return HeuresSupp;
};
