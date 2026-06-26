const Student = require('../models/Student');
const emailService = require('./emailService');
const eligibilityService = require('./eligibilityService');

exports.matchStudentsToCompany = async (company) => {
    // 1. Fetch NOT_PLACED students with projected fields to save memory
    const students = await Student.find({ placementStatus: 'NOT_PLACED' })
        .select('name email branch cgpa backlogs skills eligibleCompanies selectedCompanies applications')
        .lean();

    let eligibleStudents = [];

    if (company.applicationDeadline && Date.now() > new Date(company.applicationDeadline).getTime()) {
        return;
    }

    for (const student of students) {
        const eligibility = await eligibilityService.evaluateStudentEligibility(student, company, true);
        if (!eligibility.isEligible) continue;

        eligibleStudents.push({
            student,
            matchedSkillsCount: eligibility.matchedSkills.length
        });
    }

    // Sort: highest matchedSkillsCount, then CGPA
    eligibleStudents.sort((a, b) => {
        if (b.matchedSkillsCount !== a.matchedSkillsCount) {
            return b.matchedSkillsCount - a.matchedSkillsCount;
        }
        return b.student.cgpa - a.student.cgpa;
    });

    // Update students' eligibleCompanies field
    // Also trigger email notification
    for (const item of eligibleStudents) {
        // update the student document using updateOne
        await Student.updateOne(
            { _id: item.student._id },
            { $addToSet: { eligibleCompanies: company._id } }
        );

        // Send email
        await emailService.sendJobEligibilityEmail(item.student, company);
    }
};


exports.evaluateStudentForExistingCompanies = async (student) => {

    const PlacementDept = require('../models/PlacementDept');
    const dept = await PlacementDept.findOne();
    if (!dept) return;


    // We want to replace the student's eligible array with the freshly evaluated list
    const newEligibleCompanies = [];

    for (const company of dept.companies) {
        if (company.applicationDeadline && Date.now() > new Date(company.applicationDeadline).getTime()) {
            continue;
        }

        const eligibility = await eligibilityService.evaluateStudentEligibility(student, company, true);
        if (!eligibility.isEligible) continue;

        newEligibleCompanies.push(company._id);
    }

    // Only update if changes occurred to save DB cycles
    if (JSON.stringify(newEligibleCompanies.map(String)) !== JSON.stringify((student.eligibleCompanies || []).map(String))) {
        student.eligibleCompanies = newEligibleCompanies;
        await student.save({ validateBeforeSave: false });
    }

};
