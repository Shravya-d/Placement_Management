require('dotenv').config();
const mongoose = require('mongoose');
const Alumni = require('../models/Alumni');
const placementDeptController = require('../controllers/placementDeptController');
const fs = require('fs');

async function testPagination() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placement-db');
    
    // Seed dummy alumni if count < 60
    const count = await Alumni.countDocuments();
    if (count < 60) {
        for(let i=0; i < (65 - count); i++) {
            await Alumni.create({
                studentData: { name: `PaginationTest_${i}`, branch: "cse", skills: ["react"] },
                companyJoined: "ScaleTest Inc",
                role: "Tester",
                placedDate: Date.now()
            });
        }
    }

    const mockReq = { query: { limit: "5", page: "2" } };
    const mockRes = {
        status: function(code) { this.statusCode = code; return this; },
        json: function(payload) { this.payload = payload; return this; }
    };
    const mockNext = () => {};

    // catchAsync returns a function: (req, res, next). Await the call to that function.
    await placementDeptController.getPlacements(mockReq, mockRes, mockNext);

    fs.writeFileSync('pagination_output.json', JSON.stringify({
        returnedItemsCount: mockRes.payload.data.placements.length,
        paginationMetadata: mockRes.payload.data.pagination,
        topLevelStatus: mockRes.payload.status,
        message: mockRes.payload.message
    }, null, 2));

    console.log("Pagination Test Executed.");
    await mongoose.connection.close();
}

testPagination();
