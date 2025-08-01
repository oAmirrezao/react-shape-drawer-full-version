const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const user = await User.create({ name });
    res.status(201).json({ id: user.id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
