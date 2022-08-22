'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    slackId: { type: DataTypes.STRING, allowNull: false },
    notionUrl: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
