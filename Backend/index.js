require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const videoRoutes = require('./routes/videoRoutes');

connectDB();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL of your Frontend
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.use('/videos', express.static('public/videos'));
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));