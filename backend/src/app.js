const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const placementDeptRoutes = require('./routes/placementDeptRoutes');
const alumniRoutes = require('./routes/alumniRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/placement', placementDeptRoutes);
app.use('/api/alumni', alumniRoutes);

// Main route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Placement Management System API'
    });
});

// Handle undefined Routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
