const Student = require('../models/Student');
const PlacementDept = require('../models/PlacementDept');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');

exports.updateProfile = catchAsync(async (req, res, next) => {
    // Filter out unwanted fields
    const { name, phone, branch, cgpa, skills, resume, backlogs } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
        req.user.id,
        { name, phone, branch, cgpa, skills, resume, backlogs },
        { new: true, runValidators: true }
    );

    const matchingService = require('../services/matchingService');
    await matchingService.evaluateStudentForExistingCompanies(updatedStudent);

    res.status(200).json({
        status: 'success',
        data: {
            student: updatedStudent
        }
    });
});

exports.getEligibleCompanies = catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.user.id);
    const dept = await PlacementDept.findOne();

    if (!dept || !student.eligibleCompanies || student.eligibleCompanies.length === 0) {
        return res.status(200).json({
            status: 'success',
            data: {
                companies: []
            }
        });
    }


    dept = await PlacementDept.findOne();

    // Fix: ObjectId strict equality bug bypassing filter
    const eligibleCompanies = dept ? dept.companies.filter(c =>
        student.eligibleCompanies.some(id => id.toString() === c._id.toString())
    ) : [];

    res.status(200).json({
        status: 'success',
        data: {

            companies: eligibleCompanies

        }
    });
});

exports.applyToCompany = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;
    const studentId = req.user.id;

    const student = await Student.findById(studentId);

    if (!student.eligibleCompanies.includes(companyId)) {
        return next(new AppError('You are not eligible for this company', 403));
    }

    // Check if already applied
    const hasApplied = student.applications.some(app => app.companyId.toString() === companyId);
    if (hasApplied) {
        return next(new AppError('You have already applied to this company', 400));
    }

    // Retrieve company to match skills count
    const dept = await PlacementDept.findOne({ 'companies._id': companyId });
    if (!dept) {
        return next(new AppError('Company not found', 404));
    }

    const company = dept.companies.id(companyId);

    // Calculate match
    const studentSkills = new Set((student.skills || []).map(s => s.toLowerCase()));
    let matchedSkillsCount = 0;
    company.jdSkills.forEach(skill => {
        if (studentSkills.has(skill.toLowerCase())) {
            matchedSkillsCount++;
        }
    });

    if (matchedSkillsCount === 0) {
        return next(new AppError('You do not have any of the required skills for this role.', 400));
    }

    if (company.applicationDeadline && Date.now() > new Date(company.applicationDeadline).getTime()) {
        return next(new AppError('The application deadline for this company has already passed.', 400));
    }

    // 1. Update Student doc
    student.applications.push({
        companyId: companyId,
        status: 'APPLIED'
    });
    await student.save({ validateBeforeSave: false });

    // 2. Update PlacementDept doc
    company.applicants.push({
        studentId: student._id,
        matchedSkillsCount,
        resume: student.resume,
        status: 'APPLIED'
    });
    await dept.save({ validateBeforeSave: false });

    // Email
    await emailService.sendApplicationConfirmation(student, company);

    res.status(200).json({
        status: 'success',
        message: 'Successfully applied'
    });
});

exports.viewCompanyFeedbacks = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;

    const dept = await PlacementDept.findOne({ 'companies._id': companyId });
    if (!dept) return next(new AppError('Company not found', 404));

    const company = dept.companies.id(companyId);

    // Students can see only feedbacks
    res.status(200).json({
        status: 'success',
        data: {
            feedbacks: company.feedbacks
        }
    });
});
