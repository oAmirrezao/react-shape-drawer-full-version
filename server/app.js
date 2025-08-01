const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const paintingRoutes = require('./routes/paintings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/paintings', paintingRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Sync error:', err);
  }
})();
