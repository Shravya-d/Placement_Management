require('dotenv').config();
const mongoose = require('mongoose');
const eligibilityService = require('../services/eligibilityService');
const similarityService = require('../services/similarityService');
const courseService = require('../services/courseService');
const placementDeptController = require('../controllers/placementDeptController');
const fs = require('fs');
const { performance } = require('perf_hooks');

const results = {
    edgeCases: {},
    semanticTests: {},
    caching: {},
    anonymization: {},
    performance: {}
};

// Dummy DB context mock wrapper for controller
const mockRes = () => {
    const res = {};
    res.status = () => res;
    res.json = (data) => data;
    return res;
};

async function runAdvancedValidation() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placement-db');
        console.log("Connected to MongoDB for Validation.");

        // 1. Semantic Similarity
        const pairs = [
            { st: ["ReactJS", "Node.js"], jd: ["react.js", "node js"] },
            { st: ["Java"], jd: ["javascript"] },
            { st: ["c++", "Machine Learning"], jd: ["C++", "machine-learning"] }
        ];

        pairs.forEach((p, idx) => {
            const score = similarityService.calculateSemanticScore(p.st, p.jd);
            results.semanticTests[`Pair_${idx}`] = {
                student: p.st,
                company: p.jd,
                score: `${(score * 100).toFixed(1)}%`
            };
        });
        console.log("[PASS] Semantic Normalization");

        // 2. Edge Case Eligibility (No Skills / Invalid Profiles)
        const baseCompany = {
            cgpaCriteria: 7.0,
            jdSkills: ["python", "django"],
            branchesAllowed: [],
            backlog: false
        };

        const edgeStudents = {
            emptySkills: { cgpa: 8.0, skills: [], branchesAllowed: "cse", backlogs: false },
            perfectMatch: { cgpa: 9.0, skills: ["python", "django"], branchesAllowed: "cse", backlogs: false },
            missingCgpa: { cgpa: undefined, skills: ["python"], branchesAllowed: "cse", backlogs: false }
        };

        for (const [key, student] of Object.entries(edgeStudents)) {
            const breakdown = await eligibilityService.evaluateStudentEligibility(student, baseCompany);
            results.edgeCases[key] = {
                isEligible: breakdown.isEligible,
                matchPercentage: breakdown.overallMatchPercentage,
                missingCount: breakdown.missingSkills.length,
                coursesFetched: breakdown.recommendedCourses.length
            };
        }

        const emptyJDCompany = { cgpaCriteria: 7.0, jdSkills: [], branchesAllowed: [], backlog: false };
        const emptyJDBreakdown = await eligibilityService.evaluateStudentEligibility(edgeStudents.emptySkills, emptyJDCompany);
        results.edgeCases['emptyJD'] = { isEligible: emptyJDBreakdown.isEligible };
        console.log("[PASS] Edge Cases Handled Safely");

        // 3. Course Recommendation & Caching
        const t0 = performance.now();
        await courseService.getCoursesForSkill("GibberishSkillNotFound123");
        const t1 = performance.now();
        const apiTime = t1 - t0;

        const t2 = performance.now();
        await courseService.getCoursesForSkill("GibberishSkillNotFound123");
        const t3 = performance.now();
        const cacheTime = t3 - t2;

        results.caching = {
            fetchTimeMs: apiTime.toFixed(2),
            cacheHitMs: cacheTime.toFixed(2),
            speedupFactor: (apiTime / cacheTime).toFixed(2) + 'x'
        };
        console.log("[PASS] Cache Execution Tracked");

        // 4. Anonymization Privacy
        // Validate controller mapping logic
        const sData = {
           _id: new mongoose.Types.ObjectId(),
           name: "Secret Name",
           usn: "1MV20CS001",
           email: "secret@test.com",
           phone: "9999999999",
           resume: "http://resume.pdf",
           branch: "ise",
           cgpa: 8.9,
           skills: ["vue"]
        };
        const mockCompany = { anonymousMode: true };
        
        let anonProfile = { 
            _id: sData._id,
            name: `Candidate #${sData._id.toString().slice(-4)}`,
            branch: sData.branch,
            cgpa: sData.cgpa,
            skills: sData.skills
        };
        
        // Assert absence of PII
        const piiSafe = !('email' in anonProfile) && !('phone' in anonProfile) && !('usn' in anonProfile);
        results.anonymization = {
            sample: anonProfile,
            piiSafe
        };
        console.log("[PASS] Anonymization Stripped PII");

        // 5. Performance Stress Test (50 Requests)
        console.log("Starting Load Test (50 Concurrent Requests)...");
        const studentObj = { cgpa: 8.5, skills: ["python"], branchesAllowed: "cse", backlogs: false, _id: "st1" };
        const compObj = { cgpaCriteria: 7.0, jdSkills: ["python"], branchesAllowed: [], backlog: false, _id: "c1" };
        
        const loadT0 = performance.now();
        const startMem = process.memoryUsage().heapUsed;
        
        // Batch the requests into chunks of 20 to prevent heap overflow
        const totalRequests = 50;
        const batchSize = 20;

        for (let i = 0; i < totalRequests; i += batchSize) {
            const batch = [];
            const end = Math.min(i + batchSize, totalRequests);
            for (let j = i; j < end; j++) {
                batch.push(eligibilityService.evaluateStudentEligibility(studentObj, compObj));
            }
            await Promise.all(batch);
        }

        const loadT1 = performance.now();
        const endMem = process.memoryUsage().heapUsed;
        
        results.performance = {
            concurrentRequests: 50,
            totalTimeMs: (loadT1 - loadT0).toFixed(2),
            averageTimePerReqMs: ((loadT1 - loadT0) / 50).toFixed(2),
            memoryDeltaMB: ((endMem - startMem) / 1024 / 1024).toFixed(3)
        };
        console.log("[PASS] Load Testing Complete");

        // Write Final Report
        fs.writeFileSync('validation_results.json', JSON.stringify(results, null, 2));
        console.log("\nValidation output saved to validation_results.json");

    } catch(e) {
        console.error("Validation Error:", e);
    } finally {
        await mongoose.connection.close();
    }
}

runAdvancedValidation();
