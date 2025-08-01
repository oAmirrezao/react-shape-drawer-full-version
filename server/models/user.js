module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false }
  });
};
