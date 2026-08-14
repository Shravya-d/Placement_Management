const { isSkillMatch } = require('./similarityService');

/**
 * Eligibility Service for detailed evaluation.
 * Returns breakdown:
 * { cgpaScore, skillMatchScore, matchedSkills[], missingSkills[], branchEligible, backlogEligible, overallMatchPercentage }
 */

exports.evaluateStudentEligibility = async (student, company, skipCourseFetch = false) => {
    // 1. CGPA Check
    let cgpaScore = 0;
    const requiredCgpa = company.cgpaCriteria || 0;
    const studentCgpa = student.cgpa || 0;

    if (requiredCgpa > 0) {
        if (studentCgpa >= requiredCgpa) {
            cgpaScore = 1;
        } else {
            // Partial score if near
            cgpaScore = Math.max(0, studentCgpa / requiredCgpa);
        }
    } else {
        cgpaScore = 1; // No criteria
    }

    // 2. Skills Check
    const studentSkills = student.skills || [];
    const matchedSkills = [];
    const missingSkills = [];

    const jdSkills = company.jdSkills || [];
    jdSkills.forEach(jdSkill => {
        const isMatch = studentSkills.some(stSkill => isSkillMatch(stSkill, jdSkill));
        if (isMatch) {
            matchedSkills.push(jdSkill);
        } else {
            missingSkills.push(jdSkill);
        }
    });

    const skillMatchScore = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) : 1;

    // 3. Branch & Backlogs Check
    let branchEligible = true;
    if (company.branchesAllowed && company.branchesAllowed.length > 0) {
        const branchesAllowedLC = company.branchesAllowed.map(b => b.trim().toLowerCase());
        const stuBranchLC = (student.branch || '').trim().toLowerCase();
        if (!branchesAllowedLC.includes(stuBranchLC)) {
            branchEligible = false;
        }
    }

    let backlogEligible = true;
    if (company.backlog === false && student.backlogs === true) {
        backlogEligible = false;
    }

    // 4. Overall Percentage Calculation
    // As per user priority request: CGPA is highest weight, then Skills.
    // If Branch or Backlogs are not eligible, we can cap the percentage or reduce it heavily, 
    // but the objective Match Percentage is mostly CGPA & Skills. 
    // Let's use:
    // CGPA: 60%
    // Skills: 40%
    // Only if branch/backlog passes. If they fail, they are ineligible completely, but we still show the % calculation.

    const overallMatchPercentage = ((cgpaScore * 0.6) + (skillMatchScore * 0.4)) * 100;

    // Fetch dynamic course recommendations for missing skills
    const recommendedCourses = [];

    if (!skipCourseFetch && missingSkills.length > 0) {
        const courseService = require('./courseService');
        for (const mSkill of missingSkills) {
            const courses = await courseService.getCoursesForSkill(mSkill);
            recommendedCourses.push({
                skill: mSkill,
                courses
            });
        }
    }

    const reasons = [];
    if (!branchEligible) {
        reasons.push("Branch not eligible");
    }
    if (!backlogEligible) {
        reasons.push("Active backlogs not allowed");
    }
    if (studentCgpa < requiredCgpa) {
        reasons.push("CGPA below required minimum");
    }
    if (jdSkills.length > 0 && skillMatchScore < 0.20) {
        const currentPercentage = Math.round(skillMatchScore * 100);
        reasons.push(`Skill Match: ${currentPercentage}% (Minimum Required: 20%)`);
    }

    const isEligible = branchEligible && backlogEligible && (studentCgpa >= requiredCgpa) && (skillMatchScore >= 0.20 || jdSkills.length === 0);

    // Temporary logs requested by user
    {
        const companyLog = {
            requiredSkills: company.jdSkills,
            minimumCgpa: company.cgpaCriteria,
            allowedBranches: company.branchesAllowed
        };
        {
            const company = companyLog;
            console.log(student.skills);
            console.log(company.requiredSkills);
            console.log(matchedSkills);
            console.log(missingSkills);
            console.log(isEligible);
            console.log(student.cgpa);
            console.log(company.minimumCgpa);
            console.log(student.branch);
            console.log(company.allowedBranches);
            console.log(student.backlogs);
        }
    }

    return {
        cgpaScore,
        skillMatchScore,
        matchedSkills,
        missingSkills,
        recommendedCourses,
        branchEligible,
        backlogEligible,
        requiredCgpa,
        overallMatchPercentage: overallMatchPercentage.toFixed(2),
        isEligible,
        reasons,
        eligibilityReason: reasons,
        eligibilityReasons: reasons
    };
};
