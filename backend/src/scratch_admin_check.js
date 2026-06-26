require('dotenv').config();
const mongoose = require('mongoose');
const PlacementDept = require('./models/PlacementDept');

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placement-db');
        const dept = await PlacementDept.findOne();
        if (dept) {
            console.log("ADMIN_CHECK_RESULT: email =", dept.adminDetails.email);
        } else {
            console.log("ADMIN_CHECK_RESULT: No dept found.");
        }
    } catch (err) {
        console.error("ADMIN_CHECK_RESULT Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}
checkAdmin();
