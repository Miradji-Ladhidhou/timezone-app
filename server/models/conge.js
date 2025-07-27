'use strict';
const { Model, DataTypes } = require('sequelize');

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
    Conge.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Conge;
};