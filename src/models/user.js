'use strict'
const {
   Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
   class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate({ Sale }) {
         // define association here
         this.hasMany(Sale, { foreignKey: 'userId', as: 'sales' })
      }

      // toJSON() {
      //    return {
      //       ...this.get(),
      //       password: undefined
      //    }
      // }
   };
   User.init({
      firstName: {
         type: DataTypes.STRING,
         allowNull: false
      },
      lastName: {
         type: DataTypes.STRING,
         allowNull: false
      },
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false
      },
      verified: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
      },
      guard: {
         type: DataTypes.STRING,
         defaultValue: 'users',
      },
      name: {
         type: DataTypes.VIRTUAL,
         get() {
            return this.firstName + ' ' + this.lastName
         }
      }
   }, {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      defaultScope: {
         attributes: { exclude: ['password'] },
      }
   })
   return User
}