const Student = require('../models/Student');
const emailService = require('./emailService');

exports.matchStudentsToCompany = async (company) => {
    // 1. Fetch NOT_PLACED students
    const students = await Student.find({ placementStatus: 'NOT_PLACED' });

    let eligibleStudents = [];

    students.forEach(student => {
        // Evaluate base criteria ONLY if the company specified them
        if (company.cgpaCriteria !== undefined && company.cgpaCriteria !== null) {
            if (student.cgpa < company.cgpaCriteria) return;
        }

        if (company.backlog !== undefined && company.backlog !== null) {
            if (company.backlog === false && student.backlogs === true) return;
        }
        if (company.branchesAllowed && company.branchesAllowed.length > 0 && !company.branchesAllowed.includes(student.branch)) return;

        // Compare jdSkills vs student.skills
        const studentSkills = new Set((student.skills || []).map(s => s.toLowerCase()));
        let matchedSkillsCount = 0;

        company.jdSkills.forEach(skill => {
            if (studentSkills.has(skill.toLowerCase())) {
                matchedSkillsCount++;
            }
        });

        // Add to eligible list if matches > 0 (or simply based on criteria)
        // Adjusting constraint as "Only those students: can SEE the company can APPLY"
        // Let's assume if they have matchedSkillsCount > 0, they are pushed, OR even 0 matches might be fine if criteria fit, but let's sort them.

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
