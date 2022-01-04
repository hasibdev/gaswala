'use strict'
const {
   Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
   class Sale extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate({ User, Product }) {
         // define association here
         this.belongsTo(User, { foreignKey: 'userId' })
         // this.hasMany(Product, { foreignKey: 'productsId' })
      }
   };
   Sale.init({
      payment: {
         type: DataTypes.DOUBLE,
         defaultValue: 0
      },
      userId: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
   }, {
      sequelize,
      modelName: 'Sale',
   })
   return Sale
}