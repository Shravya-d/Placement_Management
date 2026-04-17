const courseService = require('../services/courseService');
const catchAsync = require('../utils/catchAsync');

exports.getCourses = catchAsync(async (req, res, next) => {
    const skillQuery = req.query.skill || req.query.skills;
    
    if (!skillQuery) {
        return res.status(200).json({
            status: 'success',
            data: { suggestions: [] }
        });
    }

    const skills = skillQuery.split(',').map(s => s.trim().toLowerCase());
    let suggestions = [];

    for (const skill of skills) {
        const courses = await courseService.getCoursesForSkill(skill);
        suggestions.push({
            skill,
            courses
        });
    }

    res.status(200).json({
        status: 'success',
        results: suggestions.length,
        data: {
            suggestions
        }
    });
});
