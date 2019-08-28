"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || "development";
var config = {
  development: {
    username: process.env.PSGS_USER,
    password: process.env.PSGS_PASS,
    database: "cookopedia-dev",
    host: process.env.PSGS_HOST,
    dialect: "postgres",
    logging: false,
    operatorsAliases: false
  },
  test: {
    username: "camila",
    password: "123456",
    database: "cookopedia-test",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
    operatorsAliases: false
  },
  production: {
    username: process.env.PSGS_USER,
    password: process.env.PSGS_PASS,
    database: "cookopedia-dev",
    host: process.env.PSGS_HOST,
    dialect: "postgres",
    logging: false,
    operatorsAliases: false
  }
}[env];

//const configPath = path.join(__dirname, "..", "config", "config.json");
//const configObj = require(configPath);
//const config = configObj["development"];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
