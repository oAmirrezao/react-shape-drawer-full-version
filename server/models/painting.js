module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Painting', {
    title: { type: DataTypes.STRING, allowNull: false },
    data:  { type: DataTypes.TEXT, allowNull: false }  // JSON.stringify نقاشی
  });
};
