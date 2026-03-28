const cron = require('node-cron');
const PlacementDept = require('../models/PlacementDept');
const Student = require('../models/Student');
const emailService = require('./emailService');

exports.initCronJobs = () => {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            console.log("Checking for approaching company deadlines...");
            const dept = await PlacementDept.findOne();
            if (!dept || !dept.companies || dept.companies.length === 0) return;

            const now = Date.now();
            const oneHourInMs = 60 * 60 * 1000;
            
            let needsSave = false;
            
            for (const company of dept.companies) {
                if (!company.applicationDeadline || company.alertTriggered) continue;
                
                const timeLeft = company.applicationDeadline.getTime() - now;
                
                if (timeLeft > 0 && timeLeft <= oneHourInMs) {
                    const appliedStudentIds = company.applicants.map(a => a.studentId.toString());
                    
                    const eligibleStudents = await Student.find({
                        eligibleCompanies: company._id,
                        _id: { $nin: appliedStudentIds }
                    });

                    if (eligibleStudents.length > 0) {
                        try {
                            await emailService.sendDeadlineAlert(eligibleStudents, company);
                            console.log(`Successfully sent deadline alert for ${company.companyName} to ${eligibleStudents.length} students.`);
                        } catch (err) {
                            console.error(`Failed to send email alert for ${company.companyName}:`, err);
                        }
                    }
                    
                    company.alertTriggered = true;
                    needsSave = true;
                }
            }

            if (needsSave) {
                await dept.save({ validateBeforeSave: false });
            }
        } catch (error) {
            console.error('Error in cron jobs execution:', error);
        }
    });
};
