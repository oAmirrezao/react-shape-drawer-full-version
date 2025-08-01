const express = require('express');
const router = express.Router();
const { Painting, User } = require('../models');

router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { title, shapes } = req.body;

  if (!title || !shapes) 
    return res.status(400).json({ error: 'title and shapes are required' });

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const payload = JSON.stringify({ title, shapes });
    let painting = await Painting.findOne({ where: { userId } });

    if (painting) {
      painting.title = title;
      painting.data = payload;
      await painting.save();
      return res.json({ message: 'Painting updated' });
    }

    await Painting.create({ userId, title, data: payload });
    res.status(201).json({ message: 'Painting created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const painting = await Painting.findOne({ where: { userId } });
    if (!painting) 
      return res.status(404).json({ error: 'Painting not found' });

    const parsed = JSON.parse(painting.data);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const count = await Painting.destroy({ where: { userId } });
    if (!count) return res.status(404).json({ error: 'Painting not found' });
    res.json({ message: 'Painting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
