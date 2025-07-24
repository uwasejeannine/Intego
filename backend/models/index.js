"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")["development"];
const db = {};

let sequelize;
if (config.connectionString) {
  sequelize = new Sequelize(config.connectionString, config);
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    console.log("Loaded model:", model.name);
    db[model.name] = model;
  });

// Show all loaded models before associations
console.log("Available models:", Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));

// Add error handling to associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    console.log("Associating model:", modelName);
    try {
      db[modelName].associate(db);
      console.log("✓ Successfully associated:", modelName);
    } catch (error) {
      console.error("✗ Error associating model:", modelName);
      console.error("Error details:", error.message);
      console.error("Available models for association:", Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));
      // Don't throw the error - just log it and continue
    }
  }
});

const Vaccine = require('./vaccines')(sequelize);
db.Vaccine = Vaccine;
const VaccinationRecord = require('./vaccination_records')(sequelize);
db.VaccinationRecord = VaccinationRecord;
const VaccinationCampaign = require('./vaccination_campaigns')(sequelize);
db.VaccinationCampaign = VaccinationCampaign;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;