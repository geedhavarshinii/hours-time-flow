const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection Configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    return null;
  }
};

// Retry connection logic
const connectWithRetry = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    const conn = await connectDB();
    if (conn) return conn;
    
    console.log(`Retrying connection in ${interval/1000} seconds... (Attempt ${i + 1}/${retries})`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  console.error('Failed to connect to MongoDB after multiple retries');
  process.exit(1);
};

// Define Day Schema with timestamps
const daySchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Add index for better query performance
  },
  hours: {
    type: [Boolean],
    validate: {
      validator: function(arr) {
        return arr.length === 24;
      },
      message: 'Hours array must contain exactly 24 elements'
    }
  },
  tasks: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    completed: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  }],
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes
daySchema.index({ date: 1 });

const Day = mongoose.model('Day', daySchema);

// Routes with better error handling
app.get('/api/days/:date', async (req, res, next) => {
  try {
    const day = await Day.findOne({ date: req.params.date });
    if (!day) {
      return res.json({ 
        date: req.params.date,
        hours: Array(24).fill(false), 
        tasks: [] 
      });
    }
    res.json(day);
  } catch (error) {
    console.error('Error fetching day:', error);
    res.status(500).json({ 
      error: 'Failed to fetch day data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/days/:date', async (req, res, next) => {
  try {
    const { hours, tasks } = req.body;
    
    // Validate input
    if (!Array.isArray(hours) || hours.length !== 24) {
      return res.status(400).json({ error: 'Invalid hours format' });
    }
    
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Invalid tasks format' });
    }

    const day = await Day.findOneAndUpdate(
      { date: req.params.date },
      { 
        hours, 
        tasks,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );
    res.json(day);
  } catch (error) {
    console.error('Error saving day:', error);
    res.status(500).json({ 
      error: 'Failed to save day data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server only after establishing database connection
const startServer = async () => {
  await connectWithRetry();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer(); 