'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * @typedef {Object} User
 * @property {string} nom - Nom complet de l’utilisateur
 * @property {string} email - Adresse email (doit être unique)
 * @property {string} motDePasse - Mot de passe chiffré
 * @property {string} role - Rôle de l’utilisateur : employe | secretaire | admin
 */

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

  /**
   * Association : un utilisateur a plusieurs pointages
   * @memberof User
   */
  User.associate = (models) => {
    User.hasMany(models.Pointage, {
      foreignKey: 'userId',
      as: 'pointages'
    });
  };

  return User;
};
