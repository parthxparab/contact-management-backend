'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, 
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 1=Family,2=Friends,3=Work
        validate: {
          isIn: [[1, 2, 3]],
        },
      },
    },
    {
      sequelize,
      modelName: 'Contact',
      tableName: 'Contacts',
      defaultScope: {
        attributes: { exclude: ['id'] }
      },
    }
  );
  return Contact;
};