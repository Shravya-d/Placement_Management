const PlacementDept = require('../models/PlacementDept');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');

exports.addFeedback = catchAsync(async (req, res, next) => {
    const { message, rating, companyName } = req.body;
    const alumniId = req.user.id;

    // We search the company by name to append feedback 
    // Usually companyId is better, but alumni might just pick a company name they recognize
    const dept = await PlacementDept.findOne({ 'companies.companyName': companyName });
    if (!dept) {
        return next(new AppError('Company not found', 404));
    }

    const company = dept.companies.find(c => c.companyName === companyName);
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
    // Only placed students (Alumni) can view alumni
    // req.user has been fetched from alumni logic inside restrictTo('alumni')

    // Dummy logic if Placed Students want to view all alumni
    // (A Placed Student IS an Alumni technically in our schema since they get moved to Alumni collection)
    const alumniList = await require('../models/Alumni')
        .find({ _id: { $ne: req.user.id } })
        .select('studentData.name studentData.email studentData.phone companyJoined role');

    res.status(200).json({
        status: 'success',
        data: {
            alumniList
        }
    });
});
