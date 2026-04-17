const PlacementDept = require('../models/PlacementDept');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const catchAsync = require('../utils/catchAsync');

exports.getPlacementRate = catchAsync(async (req, res, next) => {
    const unplacedCount = await Student.countDocuments();
    const placedCount = await Alumni.countDocuments();
    const total = unplacedCount + placedCount;
    
    // Calculate yearly trends based on placedDate
    const yearlyRaw = await Alumni.aggregate([
        {
            $group: {
                _id: { $year: "$placedDate" },
                placed: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    
    const yearly = yearlyRaw.map(y => ({
        year: y._id,
        placed: y.placed
    }));

    res.status(200).json({
        status: 'success',
        data: {
            total,
            placedCount,
            unplacedCount,
            placementPercentage: total > 0 ? ((placedCount / total) * 100).toFixed(2) : 0,
            yearlyTrends: yearly
        }
    });
});

exports.getDepartmentsStats = catchAsync(async (req, res, next) => {
    const departmentStats = await Alumni.aggregate([
        {
            $group: {
                _id: "$studentData.branch",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    const formatted = departmentStats.map(d => ({
        department: d._id || 'Unknown',
        placedStudents: d.count
    }));

    res.status(200).json({
        status: 'success',
        data: {
            departments: formatted
        }
    });
});

exports.getCompanyStats = catchAsync(async (req, res, next) => {
    const companyStats = await Alumni.aggregate([
        {
            $group: {
                _id: "$companyJoined",
                hires: { $sum: 1 }
            }
        },
        { $sort: { hires: -1 } }
    ]);

    const formatted = companyStats.map(c => ({
        company: c._id || 'Unknown',
        hires: c.hires
    }));

    res.status(200).json({
        status: 'success',
        data: {
            companyStats: formatted
        }
    });
});

exports.getFunnelStats = catchAsync(async (req, res, next) => {
    const stats = await PlacementDept.aggregate([
        { $unwind: "$companies" },
        { $unwind: "$companies.applicants" },
        { 
            $group: { 
                _id: "$companies.applicants.status", 
                count: { $sum: 1 } 
            } 
        }
    ]);

    let applied = 0;
    let selected = 0;

    stats.forEach(s => {
        if (s._id === 'APPLIED') applied += s.count;
        if (s._id === 'SELECTED') {
            selected += s.count;
            // A selected student is also an applicant
            applied += s.count;
        }
        if (s._id === 'REJECTED') applied += s.count;
    });

    res.status(200).json({
        status: 'success',
        data: {
            funnel: [
                { stage: 'Applied', count: applied },
                { stage: 'Selected', count: selected }
            ]
        }
    });
});

exports.getTopSkillsInDemand = catchAsync(async (req, res, next) => {
    // Determine the top 10 skills across all JDs using aggregation.
    // Converts arrays to lower case and trims to standardize
    const stats = await PlacementDept.aggregate([
        { $unwind: "$companies" },
        { $unwind: "$companies.jdSkills" },
        { 
            $project: { 
                skill: { $toLower: { $trim: { input: "$companies.jdSkills" } } } 
            } 
        },
        { 
            $group: { 
                _id: "$skill", 
                demand: { $sum: 1 } 
            } 
        },
        { $sort: { demand: -1 } },
        { $limit: 10 },
        { 
            $project: { 
                skill: "$_id", 
                demand: 1, 
                _id: 0 
            } 
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            topSkills: stats
        }
    });
});
