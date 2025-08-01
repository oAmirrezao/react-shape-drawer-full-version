const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite')
});

const User = require('./user')(sequelize);
const Painting = require('./painting')(sequelize);

// یک به یک
User.hasOne(Painting, { foreignKey: 'userId', onDelete: 'CASCADE' });
Painting.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Painting };
