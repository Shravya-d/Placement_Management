const PlacementDept = require('../models/PlacementDept');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const matchingService = require('../services/matchingService');
const emailService = require('../services/emailService');

exports.addCompany = catchAsync(async (req, res, next) => {
    let dept = await PlacementDept.findOne().select('+adminDetails.password');
    if (!dept) {
        return next(new AppError('Department not configured', 500));
    }

    if (!req.body.applicationDeadline || new Date(req.body.applicationDeadline).getTime() <= Date.now()) {
        return next(new AppError('A valid future application deadline is required.', 400));
    }

    const newCompanyData = {
        companyName: req.body.companyName,
        role: req.body.role,
        jdSkills: req.body.jdSkills,
        cgpaCriteria: req.body.cgpaCriteria,
        backlog: req.body.backlog,
        branchesAllowed: req.body.branchesAllowed,
        numberOfCandidates: req.body.numberOfCandidates,
        visitDate: req.body.visitDate,
        applicationDeadline: req.body.applicationDeadline,
        description: req.body.description
    };

    dept.companies.push(newCompanyData);
    await dept.save();

    const freshlyAddedCompany = dept.companies[dept.companies.length - 1];

    // Trigger matching algorithm
    await matchingService.matchStudentsToCompany(freshlyAddedCompany);

    res.status(201).json({
        status: 'success',
        data: {
            company: freshlyAddedCompany
        }
    });
});

exports.selectStudents = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;
    const { studentIds } = req.body; // array of ObjectIds

    const dept = await PlacementDept.findOne({ 'companies._id': companyId });
    if (!dept) return next(new AppError('Company not found', 404));

    const company = dept.companies.id(companyId);

    const students = await Student.find({ _id: { $in: studentIds } });

    for (const student of students) {
        // 1. Mark as SELECTED in placement department document
        const applicant = company.applicants.find(a => a.studentId.toString() === student._id.toString());
        if (applicant) applicant.status = 'SELECTED';
        company.selectedStudents.push(student._id);

        // 2. Mark student application status to PLACED
        student.placementStatus = 'PLACED';
        const stApp = student.applications.find(a => a.companyId.toString() === companyId);
        if (stApp) stApp.status = 'SELECTED';

        // 3. Move to Alumni 
        // Need to transfer hashed password from DB since it was unselected by default inside Auth
        const studentWithPass = await Student.findById(student._id).select('+password');

        await Alumni.create({
            studentData: {
                name: student.name,
                email: student.email,
                usn: student.usn,
                phone: student.phone,
                branch: student.branch,
                cgpa: student.cgpa,
                skills: student.skills,
                resume: student.resume
            },
            password: studentWithPass.password, // Keep the same password for Alumni Login
            companyJoined: company.companyName,
            role: company.role,
            placedDate: Date.now()
        });

        // 4. Remove from active student list
        await Student.findByIdAndDelete(student._id);

        // 5. Email
        await emailService.sendSelectionEmail(student, company);
    }

    await dept.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Successfully placed selected students'
    });
});

exports.getCompanyHistory = catchAsync(async (req, res, next) => {
    // Last 3 years
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const dept = await PlacementDept.findOne();
    if (!dept) return next(new AppError('Dept not configured', 500));

    const history = dept.companies
        .filter(c => c.visitDate >= threeYearsAgo)
        .map(c => {
            return {
                companyName: c.companyName,
                numberOfStudentsPlaced: c.selectedStudents.length,
                visitDate: c.visitDate,
                feedbacks: c.feedbacks
            };
        });

    res.status(200).json({
        status: 'success',
        results: history.length,
        data: {
            history
        }
    });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    // Only allow specific admin details to be updated (exclude email/password/role)
    const { name, phone } = req.body;
    
    // We only have one PlacementDept document historically. Find it.
    const dept = await PlacementDept.findOne();
    if (!dept) return next(new AppError('Admin department not found', 404));

    if (name) dept.adminDetails.name = name;
    if (phone) dept.adminDetails.phone = phone;

    await dept.save({ validateBeforeSave: false });

    // Format the response to exactly match auth return structure (user object)
    const user = dept.adminDetails.toObject();
    user.id = dept._id; // Ensure consistent id mapping for Frontend
    user.role = 'admin';

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.getCompanyApplicants = catchAsync(async (req, res, next) => {
    const dept = await PlacementDept.findOne().populate({
        path: 'companies.applicants.studentId',
        select: 'name email usn cgpa branch skills resume applications'
    });

    if (!dept) {
        return res.status(200).json({ status: 'success', data: { companies: [] } });
    }

    const companiesWithApplicants = dept.companies.map(company => {
        const activeApplicants = company.applicants
            .filter(app => app.status === 'APPLIED' && app.studentId)
            .sort((a, b) => (b.matchedSkillsCount || 0) - (a.matchedSkillsCount || 0));

        return {
            _id: company._id,
            companyName: company.companyName,
            role: company.role,
            jdSkills: company.jdSkills,
            applicants: activeApplicants
        };
    }).filter(c => c.applicants.length > 0);

    res.status(200).json({
        status: 'success',
        results: companiesWithApplicants.length,
        data: {
            companies: companiesWithApplicants
        }
    });
});

exports.rejectStudents = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;
    const { studentIds } = req.body;

    const dept = await PlacementDept.findOne({ 'companies._id': companyId });
    if (!dept) return next(new AppError('Company not found', 404));

    const company = dept.companies.id(companyId);

    const students = await Student.find({ _id: { $in: studentIds } });

    for (const student of students) {
        // Mark local applicant document as REJECTED
        const applicant = company.applicants.find(a => a.studentId.toString() === student._id.toString());
        if (applicant) applicant.status = 'REJECTED';

        // Update exact application object natively
        const stApp = student.applications.find(a => a.companyId.toString() === companyId);
        if (stApp) stApp.status = 'REJECTED';
        
        await student.save({ validateBeforeSave: false });

        // Automated standard dispatch
        await emailService.sendRejectionEmail(student, company);
    }

    await dept.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Successfully rejected selected students'
    });
});
