'use strict'
const faker = require('faker')
const bcrypt = require("bcrypt")

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const password = await bcrypt.hash('123456', 10)

      await queryInterface.bulkInsert('users', [...Array(100)].map(() => ({
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         email: faker.internet.email(),
         password,
         guard: 'users',

         createdAt: new Date(),
         updatedAt: new Date()
      })), {})
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('users', null, {})
   }
}
