const PlacementDept = require('../models/PlacementDept');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');

exports.addFeedback = catchAsync(async (req, res, next) => {
    const { message, rating } = req.body;
    const alumniId = req.user.id;
    const companyName = req.user.companyJoined;

    if (!companyName) {
        return next(new AppError('You are not mapped to any company.', 400));
    }

    // We search the company by name to append feedback 
    const dept = await PlacementDept.findOne({ 'companies.companyName': companyName });
    if (!dept) {
        return next(new AppError('Company not found in recent records', 404));
    }

    const company = dept.companies.find(c => c.companyName === companyName);
    if (!company) {
        return next(new AppError('Company not found in array', 404));
    }
    
    company.feedbacks.push({
        alumniId,
        message,
        rating
    });

    await dept.save({ validateBeforeSave: false });

    // Send email to admin
    await emailService.sendFeedbackNotification(dept.adminDetails.email, companyName);

    res.status(201).json({
        status: 'success',
        message: 'Feedback added successfully'
    });
});

exports.viewAlumniContactDetails = catchAsync(async (req, res, next) => {
    // Only placed students (Alumni) can view alumni from the same company
    const alumniList = await require('../models/Alumni')
        .find({ 
            _id: { $ne: req.user.id },
            companyJoined: req.user.companyJoined
        })
        .select('studentData.name studentData.email studentData.phone companyJoined role');

    res.status(200).json({
        status: 'success',
        data: {
            alumniList
        }
    });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    const { name, phone, resume, skills, companyJoined, jobRole } = req.body;
    
    const AlumniModel = require('../models/Alumni');
    const alumni = await AlumniModel.findById(req.user.id);
    if (!alumni) return next(new AppError('Alumni not found', 404));

    if (name) alumni.studentData.name = name;
    if (phone) alumni.studentData.phone = phone;
    if (resume) alumni.studentData.resume = resume;
    if (skills) alumni.studentData.skills = skills;
    if (companyJoined) alumni.companyJoined = companyJoined;
    if (jobRole) alumni.role = jobRole; // their job designation, not appRole

    await alumni.save({ validateBeforeSave: false });

    const user = alumni.toObject();
    user.id = alumni._id;
    user.role = 'alumni';

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
