'use strict';
const { Model, DataTypes } = require('sequelize');

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
        throw new Error('❌ Impossible de modifier heures_restantes car elle est générée par la base.');
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

  HeuresSupp.associate = (models) => {
    HeuresSupp.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User'
    });
  };

  return HeuresSupp;
};
