`use strict`;
const { Model, DataTypes } = require('sequelize');

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

  Pointage.associate = models => {
  Pointage.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

  };

  return Pointage;
};
