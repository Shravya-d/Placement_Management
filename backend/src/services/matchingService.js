const Student = require('../models/Student');
const emailService = require('./emailService');

exports.matchStudentsToCompany = async (company) => {
    // 1. Fetch NOT_PLACED students
    const students = await Student.find({ placementStatus: 'NOT_PLACED' });

    let eligibleStudents = [];

    students.forEach(student => {
        if (company.applicationDeadline && Date.now() > new Date(company.applicationDeadline).getTime()) {
            return;
        }

        // Evaluate base criteria ONLY if the company specified them
        if (company.cgpaCriteria !== undefined && company.cgpaCriteria !== null) {
            if (student.cgpa < company.cgpaCriteria) return;
        }

        if (company.backlog !== undefined && company.backlog !== null) {
            if (company.backlog === false && student.backlogs === true) return;
        }

        // Case-insensitive branches check
        if (company.branchesAllowed && company.branchesAllowed.length > 0) {
            const branchesAllowedLC = company.branchesAllowed.map(b => b.toLowerCase());
            if (!branchesAllowedLC.includes((student.branch || '').toLowerCase())) return;
        }

        // Compare jdSkills vs student.skills
        const studentSkills = new Set((student.skills || []).map(s => s.toLowerCase()));
        let matchedSkillsCount = 0;

        company.jdSkills.forEach(skill => {
            if (studentSkills.has(skill.toLowerCase())) {
                matchedSkillsCount++;
            }
        });

        // Add to eligible list only if matches > 0 (MUST have at least one required skill)
        if (matchedSkillsCount === 0) return;


        // Push anyway if eligible by criteria, but sort by match count
        eligibleStudents.push({
            student,
            matchedSkillsCount
        });
    });

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
        // update the student document
        item.student.eligibleCompanies.push(company._id);
        await item.student.save({ validateBeforeSave: false });

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

    const studentSkills = new Set((student.skills || []).map(s => s.toLowerCase()));

    for (const company of dept.companies) {
        if (company.applicationDeadline && Date.now() > new Date(company.applicationDeadline).getTime()) {
            continue;
        }

        if (company.cgpaCriteria !== undefined && company.cgpaCriteria !== null) {
            if (student.cgpa < company.cgpaCriteria) continue;
        }

        if (company.backlog !== undefined && company.backlog !== null) {
            if (company.backlog === false && student.backlogs === true) continue;
        }

        if (company.branchesAllowed && company.branchesAllowed.length > 0) {
            const branchesAllowedLC = company.branchesAllowed.map(b => b.toLowerCase());
            if (!branchesAllowedLC.includes((student.branch || '').toLowerCase())) continue;
        }

        let matchedSkillsCount = 0;
        company.jdSkills.forEach(skill => {
            if (studentSkills.has(skill.toLowerCase())) {
                matchedSkillsCount++;
            }
        });

        if (matchedSkillsCount === 0) continue;


        newEligibleCompanies.push(company._id);
    }

    // Only update if changes occurred to save DB cycles
    if (JSON.stringify(newEligibleCompanies.map(String)) !== JSON.stringify((student.eligibleCompanies || []).map(String))) {
        student.eligibleCompanies = newEligibleCompanies;
        await student.save({ validateBeforeSave: false });
    }
};
