const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
console.log('⏳ Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s for faster feedback
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error Details:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.message.includes('IP')) {
      console.error('👉 TIP: Check your MongoDB Atlas IP Whitelist!');
    }
  });

mongoose.connection.on('error', err => {
  console.error('🚨 Mongoose runtime error:', err);
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'connected', database: 'MongoDB', message: 'Core matrix is stable.' });
});

// Import and use routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');

app.use('/api/user', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
});
