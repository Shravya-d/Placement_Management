require('dotenv').config();
const mongoose = require('mongoose');
const PlacementDept = require('./src/models/PlacementDept');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        let dept = await PlacementDept.findOne();
        if (!dept) {
            console.log('No dept found');
            process.exit(1);
        }

        const newCompanyData = {
            companyName: "Test Company",
            role: "SDE",
            jdSkills: ["React", "Node"],
            cgpaCriteria: 7.5,
            backlog: false,
            branchesAllowed: ["CSE", "ISE"],
            numberOfCandidates: 10,
            visitDate: new Date(),
            applicationDeadline: new Date(Date.now() + 86400000),
            description: "Test description"
        };

        dept.companies.push(newCompanyData);
        await dept.save();
        console.log('Company added successfully!');
    } catch (err) {
        console.error('Error adding company:', err.message);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}).catch(err => {
    console.error(err);
    process.exit(1);
});
