const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
const PlacementDept = require('./src/models/PlacementDept');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        let dept = await PlacementDept.findOne().select('+adminDetails.password');
        if (!dept) {
            fs.writeFileSync('err_out.txt', 'No dept found\\n');
            process.exit(1);
        }

        const newCompanyData = {
            companyName: "Google",
            role: "SDE",
            jdSkills: ["React", "Node"],
            cgpaCriteria: 8.0,
            backlog: false,
            branchesAllowed: ["CSE"],
            numberOfCandidates: 5,
            visitDate: new Date(),
            applicationDeadline: new Date(Date.now() + 86400000),
            description: "Test"
        };

        dept.companies.push(newCompanyData);
        await dept.save();
        fs.writeFileSync('err_out.txt', 'Company added successfully!\\n');
    } catch (err) {
        fs.writeFileSync('err_out.txt', 'Error: ' + err.name + '\\nMessage: ' + err.message + '\\nStack: ' + err.stack + '\\n');
    } finally {
        mongoose.disconnect();
    }
}).catch(err => {
    fs.writeFileSync('err_out.txt', 'Connect error: ' + err.message + '\\n');
});
