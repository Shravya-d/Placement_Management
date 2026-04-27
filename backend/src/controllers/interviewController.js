const Interview = require('../models/Interview');
const Student = require('../models/Student');
const PlacementDept = require('../models/PlacementDept');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.assignInterview = catchAsync(async (req, res, next) => {
    const { studentId, companyId, date, time, mode, meetingLink, location } = req.body;

    // 1. Check if student has applied to this company
    const student = await Student.findById(studentId);
    if (!student) {
        return next(new AppError('Student not found', 404));
    }

    const application = student.applications.find(app => app.companyId.toString() === companyId);
    if (!application) {
        return next(new AppError('Student has not applied to this company', 400));
    }

    // 2. Check for existing active interview for this company
    const existingInterview = await Interview.findOne({
        studentId,
        companyId,
        status: { $in: ['scheduled'] }
    });

    if (existingInterview) {
        return next(new AppError('An active interview is already scheduled for this company.', 400));
    }

    // 3. Create Interview
    const newInterview = await Interview.create({
        studentId,
        companyId,
        date,
        time,
        mode,
        meetingLink,
        location,
        status: 'scheduled'
    });

    // 4. Update Application Status to INTERVIEW_SCHEDULED
    // In Student
    await Student.updateOne(
        { _id: studentId, 'applications.companyId': companyId },
        { $set: { 'applications.$.status': 'INTERVIEW_SCHEDULED' } }
    );

    // In PlacementDept
    await PlacementDept.updateOne(
        { 'companies._id': companyId, 'companies.applicants.studentId': studentId },
        { $set: { 'companies.$[comp].applicants.$[app].status': 'INTERVIEW_SCHEDULED' } },
        { 
            arrayFilters: [
                { 'comp._id': companyId },
                { 'app.studentId': studentId }
            ]
        }
    );

    res.status(201).json({
        status: 'success',
        data: {
            interview: newInterview
        }
    });
});

exports.getStudentInterviews = catchAsync(async (req, res, next) => {
    const studentId = req.params.id;

    // Fetch interviews
    const interviews = await Interview.find({ studentId }).sort({ date: 1, time: 1 });

    // Populate company details manually since companyId points to an object inside PlacementDept
    const placementData = await PlacementDept.findOne({ 'companies._id': { $in: interviews.map(i => i.companyId) } });
    
    let populatedInterviews = [];
    if (placementData) {
        populatedInterviews = interviews.map(interview => {
            const company = placementData.companies.id(interview.companyId);
            return {
                ...interview.toObject(),
                companyName: company ? company.companyName : 'Unknown Company',
                role: company ? company.role : 'Unknown Role'
            };
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            interviews: populatedInterviews
        }
    });
});

exports.updateInterviewStatus = catchAsync(async (req, res, next) => {
    const { studentId, companyId, status } = req.body;

    const interview = await Interview.findOne({ studentId, companyId, status: { $in: ['scheduled', 'completed'] } });
    if (!interview) {
        return next(new AppError('Active interview not found', 404));
    }

    interview.status = status;
    await interview.save();

    // If status updated to COMPLETED, update application status
    if (status === 'completed') {
        await Student.updateOne(
            { _id: studentId, 'applications.companyId': companyId },
            { $set: { 'applications.$.status': 'COMPLETED' } }
        );

        await PlacementDept.updateOne(
            { 'companies._id': companyId, 'companies.applicants.studentId': studentId },
            { $set: { 'companies.$[comp].applicants.$[app].status': 'COMPLETED' } },
            { 
                arrayFilters: [
                    { 'comp._id': companyId },
                    { 'app.studentId': studentId }
                ]
            }
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            interview
        }
    });
});
