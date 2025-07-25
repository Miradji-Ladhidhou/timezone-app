'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    motDePasse: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mot_de_passe'
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'employe',
      validate: {
        isIn: [['employe', 'secretaire', 'admin']]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true 
  });

  return User;
};
