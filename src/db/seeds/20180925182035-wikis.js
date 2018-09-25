'use strict';

const faker = require("faker");

 let wikis = [];

 for(let i = 1 ; i <= 10 ; i++){
   wikis.push({
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     userId:  Math.floor(Math.random() * (30 - 21)) + 21,
     createdAt: new Date(),
     updatedAt: new Date()
   });
 }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};