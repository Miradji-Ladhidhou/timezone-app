'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const db = {};
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

// Importation dynamique des modèles
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Association des modèles
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Relations manuelles
if (db.HeuresSupp && db.User) {
  db.HeuresSupp.belongsTo(db.User, { foreignKey: 'user_id', as: 'utilisateur_heures' });
}

if (db.Pointage && db.User) {
  db.Pointage.belongsTo(db.User, { foreignKey: 'user_id', as: 'utilisateur_pointage' });
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
