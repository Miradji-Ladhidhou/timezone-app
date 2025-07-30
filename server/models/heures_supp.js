'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HeuresSupp extends Model {}

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
    heures: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recuperee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'HeuresSupp',
    tableName: 'heures_supp',
    underscored: true,
    timestamps: true
  });

  HeuresSupp.associate = (models) => {
    HeuresSupp.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User'
    });
  };

  return HeuresSupp;
};
