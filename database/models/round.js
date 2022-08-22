'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {}

  Round.init({
    responseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    usersPool: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const storedValue = this.getDataValue('usersPool');
        return (storedValue || '').split(',').filter(item => !!item);
      },
      set(value) {
        const poolToString = (value || []).filter(item => !!item).join(',');
        this.setDataValue('usersPool', poolToString);
      }
    }
  }, {
    sequelize,
    modelName: 'Round',
  });

  return Round;
};
