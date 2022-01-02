'use strict'

const faker = require('faker')

const units = ['12kg', '35kg', '22kg']

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('products', [...Array(100)].map((_, i) => ({
         name: faker.commerce.productName(),
         price: faker.commerce.price(),
         unit: units[Math.floor(Math.random() * units.length)],

         createdAt: new Date(),
         updatedAt: new Date()
      })), {})
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('products', null, {})
   }
}
