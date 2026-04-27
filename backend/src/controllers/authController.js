/* const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const PlacementDept = require('../models/PlacementDept');
const Alumni = require('../models/Alumni');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super-secret-key-for-jwt-needs-to-be-32-chars-long', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id || user.id, user.role || (user.adminDetails ? 'admin' : 'student'));

    const cookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '90') * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    
    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.registerStudent = catchAsync(async (req, res, next) => {
    const newStudent = await Student.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        usn: req.body.usn,
        phone: req.body.phone,
        branch: req.body.branch,
        cgpa: req.body.cgpa,
        skills: req.body.skills,
        backlogs: req.body.backlogs,
        resume: req.body.resume
    });

    const matchingService = require('../services/matchingService');

    await matchingService.evaluateStudentForExistingCompanies(newStudent);

    await emailService.sendRegistrationEmail(newStudent);

    createSendToken(newStudent, 201, req, res);
});

exports.registerAdmin = catchAsync(async (req, res, next) => {
    // There should typically only be one Placement Department. Let's enforce that.
    const existingDept = await PlacementDept.findOne();
    if (existingDept) {
        return next(new AppError('Placement Department already exists! Only one admin department is permitted.', 400));
    }

    const { name, email, phone, password } = req.body;

    const newDept = await PlacementDept.create({
        adminDetails: {
            name,
            email,
            phone,
            password,
            role: 'admin'
        },
        companies: []
    });

    newDept.role = 'admin';
    newDept.id = newDept._id;

    createSendToken(newDept, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body; // role: 'student', 'admin', 'alumni'

    if (!email || !password || !role) {
        return next(new AppError('Please provide email, password and role!', 400));
    }

    let user;
    let actualUserDoc;

    if (role === 'admin') {
        actualUserDoc = await PlacementDept.findOne({ 'adminDetails.email': email }).select('+adminDetails.password');
        if (actualUserDoc) user = actualUserDoc.adminDetails;
    } else if (role === 'alumni') {
        actualUserDoc = await Alumni.findOne({ 'studentData.email': email }).select('+password');
        user = actualUserDoc;
    } else {
        actualUserDoc = await Student.findOne({ email }).select('+password');
        user = actualUserDoc;
    }

    if (!actualUserDoc || !(await actualUserDoc.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // Pass the main document to createSendToken so we have _id
    actualUserDoc.role = role;
    if (role === 'admin') {
        actualUserDoc.id = actualUserDoc._id; // make auth identify the dept id
        await emailService.sendAdminLoginEmail(actualUserDoc.adminDetails);
    }

    createSendToken(actualUserDoc, 200, req, res);
});
 */

const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const PlacementDept = require('../models/PlacementDept');
const Alumni = require('../models/Alumni');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');

// 🔹 SIGN TOKEN
const signToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'super-secret-key-for-jwt-needs-to-be-32-chars-long',
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '90d'
        }
    );
};

// 🔹 SEND TOKEN
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(
        user._id || user.id,
        user.role || (user.adminDetails ? 'admin' : 'student')
    );

    const cookieOptions = {
        expires: new Date(
            Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '90') *
            24 *
            60 *
            60 *
            1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// 🔹 REGISTER STUDENT
exports.registerStudent = catchAsync(async (req, res, next) => {
    const newStudent = await Student.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        usn: req.body.usn,
        phone: req.body.phone,
        branch: req.body.branch,
        cgpa: req.body.cgpa,
        skills: req.body.skills,
        backlogs: req.body.backlogs,
        resume: req.body.resume
    });

    const matchingService = require('../services/matchingService');
    await matchingService.evaluateStudentForExistingCompanies(newStudent);

    await emailService.sendRegistrationEmail(newStudent);

    createSendToken(newStudent, 201, req, res);
});

// 🔹 REGISTER ADMIN
exports.registerAdmin = catchAsync(async (req, res, next) => {
    const existingDept = await PlacementDept.findOne();
    if (existingDept) {
        return next(
            new AppError(
                'Placement Department already exists!',
                400
            )
        );
    }

    const { name, email, phone, password } = req.body;

    const newDept = await PlacementDept.create({
        adminDetails: {
            name,
            email,
            phone,
            password,
            role: 'admin'
        },
        companies: []
    });

    newDept.role = 'admin';
    newDept.id = newDept._id;

    createSendToken(newDept, 201, req, res);
});

// 🔹 LOGIN
exports.login = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(
            new AppError(
                'Please provide email, password and role!',
                400
            )
        );
    }

    let user;
    let actualUserDoc;

    if (role === 'admin') {
        actualUserDoc = await PlacementDept.findOne({
            'adminDetails.email': email
        }).select('+adminDetails.password');
        if (actualUserDoc) user = actualUserDoc.adminDetails;
    } else if (role === 'alumni') {
        actualUserDoc = await Alumni.findOne({
            'studentData.email': email
        }).select('+password');
        user = actualUserDoc;
    } else {
        actualUserDoc = await Student.findOne({ email }).select('+password');
        user = actualUserDoc;
    }

    if (
        !actualUserDoc ||
        !(await actualUserDoc.correctPassword(password, user.password))
    ) {
        return next(new AppError('Incorrect email or password', 401));
    }

    actualUserDoc.role = role;

    if (role === 'admin') {
        actualUserDoc.id = actualUserDoc._id;
        await emailService.sendAdminLoginEmail(actualUserDoc.adminDetails);
    }

    createSendToken(actualUserDoc, 200, req, res);
});

// 🔐 PROTECT ROUTES (Middleware)
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in!', 401));
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super-secret-key-for-jwt-needs-to-be-32-chars-long'
    );

    let currentUser;

    if (decoded.role === 'admin') {
        currentUser = await PlacementDept.findById(decoded.id);
    } else if (decoded.role === 'alumni') {
        currentUser = await Alumni.findById(decoded.id);
    } else {
        currentUser = await Student.findById(decoded.id);
    }

    if (!currentUser) {
        return next(new AppError('User no longer exists!', 401));
    }

    req.user = currentUser;
    req.user.role = decoded.role;

    next();
});

// 🔐 RESTRICT ACCESS BASED ON ROLE
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }
        next();
    };
};