const Student = require('../models/Student');
const PlacementDept = require('../models/PlacementDept');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');
const { isSkillMatch } = require('../services/similarityService');

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
    let student = await Student.findById(req.user.id);
    const dept = await PlacementDept.findOne();

    if (!dept) {
        return res.status(200).json({
            status: 'success',
            data: { companies: [] }
        });
    }

    // Force real-time sync of eligibility in backend matching
    const matchingService = require('../services/matchingService');
    await matchingService.evaluateStudentForExistingCompanies(student);
    
    // Fetch student again in case evaluateStudentForExistingCompanies updated the array
    student = await Student.findById(req.user.id);

    // Filter to only active companies (deadline has not passed)
    const activeCompanies = dept.companies.filter(c => {
        if (c.applicationDeadline && Date.now() > new Date(c.applicationDeadline).getTime()) {
            return false;
        }
        return true;
    });

    const eligibilityService = require('../services/eligibilityService');
    const decoratedCompanies = [];

    for (const company of activeCompanies) {
        const eligibility = await eligibilityService.evaluateStudentEligibility(student, company);
        decoratedCompanies.push({
            ...company.toObject(),
            isEligible: eligibility.isEligible,
            overallMatchPercentage: eligibility.overallMatchPercentage,
            skillMatchScore: eligibility.skillMatchScore,
            matchedSkills: eligibility.matchedSkills,
            missingSkills: eligibility.missingSkills,
            branchEligible: eligibility.branchEligible,
            backlogEligible: eligibility.backlogEligible,
            eligibilityReasons: eligibility.reasons,
            eligibilityReason: eligibility.reasons
        });
    }

    res.status(200).json({
        status: 'success',
        data: { companies: decoratedCompanies }
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

    // Check if positions are already filled or company is closed
    const selectedCount = company.selectedStudents ? company.selectedStudents.length : 0;
    if (company.status === 'FILLED' || company.status === 'CLOSED' || (company.numberOfCandidates && selectedCount >= company.numberOfCandidates)) {
        return next(new AppError('This company has already filled all available positions.', 400));
    }

    const eligibilityService = require('../services/eligibilityService');
    const eligibility = await eligibilityService.evaluateStudentEligibility(student, company);
    if (!eligibility.isEligible) {
        return next(new AppError('You are not eligible for this company', 403));
    }

    const matchedSkillsCount = eligibility.matchedSkills.length;

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

exports.getCompanyEligibility = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;
    const student = await Student.findById(req.user.id);
    
    const dept = await PlacementDept.findOne({ 'companies._id': companyId });
    if (!dept) return next(new AppError('Company not found', 404));

    const company = dept.companies.id(companyId);
    
    const eligibilityService = require('../services/eligibilityService');
    const breakdown = await eligibilityService.evaluateStudentEligibility(student, company);
    
    res.status(200).json({
        status: 'success',
        data: {
            ...breakdown,
            companyName: company.companyName,
            role: company.role,
            stipend: company.stipend,
            ctc: company.ctc,
            jdSkills: company.jdSkills,
            cgpaCriteria: company.cgpaCriteria
        }
    });
});
