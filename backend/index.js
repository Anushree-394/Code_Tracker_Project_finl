const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career-platform';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/profile', require('./routes/profile'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/leetcode', require('./routes/leetcode'));
app.use('/api/contests', require('./routes/contests'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/aptitude', require('./routes/aptitude'));
app.use('/api/codechef', require('./routes/codechef'));
app.use('/api/atcoder', require('./routes/atcoder'));
app.use('/api/resume', require('./routes/resume'));
app.get('/api/test', (req, res) => res.json({ msg: 'Backend is working!' }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
