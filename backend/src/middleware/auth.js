const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Student = require('../models/Student');
const PlacementDept = require('../models/PlacementDept');
const Alumni = require('../models/Alumni');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.toLowerCase().startsWith('bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'super-secret-key-for-jwt-needs-to-be-32-chars-long');

    // Check which collection the user belongs to based on decoded role
    let currentUser;
    if (decoded.role === 'admin') {
        const dept = await PlacementDept.findById(decoded.id);
        if (dept) currentUser = dept.adminDetails;
    } else if (decoded.role === 'alumni') {
        currentUser = await Alumni.findById(decoded.id);
    } else {
        currentUser = await Student.findById(decoded.id);
    }

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // Include id and role in user object to easily identify the role later
    req.user = currentUser;
    req.user.role = decoded.role;
    req.user.id = decoded.id; // ensure ID is accessible

    next();
});
