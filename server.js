const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema
const taskSchema = new mongoose.Schema({
  date: { type: String, required: true }, // yyyy-MM-dd format
  hours: [Boolean],
  tasks: [{
    text: String,
    completed: Boolean
  }],
  lastModified: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/api/days/:date', async (req, res) => {
  try {
    const data = await Task.findOne({ date: req.params.date });
    res.json(data || { hours: Array(24).fill(false), tasks: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/days/:date', async (req, res) => {
  try {
    const { hours, tasks } = req.body;
    const data = await Task.findOneAndUpdate(
      { date: req.params.date },
      { hours, tasks, lastModified: new Date() },
      { upsert: true, new: true }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 