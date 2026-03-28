const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        auth: {
            user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
            pass: process.env.EMAIL_PASS || 'password123'
        }
    });
};

const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: 'Placement Department <no-reply@placement.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.sendRegistrationEmail = async (user) => {
    await sendEmail({
        email: user.email,
        subject: 'Welcome to Placement Portal',
        message: `Hello ${user.name},\n\nYour account has been successfully created!`
    });
};

exports.sendJobEligibilityEmail = async (student, company) => {
    await sendEmail({
        email: student.email,
        subject: `New Job Opportunity: ${company.companyName}`,
        message: `Hello ${student.name},\n\nYou are eligible for the newly added role at ${company.companyName}. Login to apply.`
    });
};

exports.sendApplicationConfirmation = async (student, company) => {
    await sendEmail({
        email: student.email,
        subject: `Application Received: ${company.companyName}`,
        message: `Hello ${student.name},\n\nYour application for ${company.role} at ${company.companyName} has been received.`
    });
};

exports.sendSelectionEmail = async (student, company) => {
    await sendEmail({
        email: student.email,
        subject: `Congratulations! Selected at ${company.companyName}`,
        message: `Hello ${student.name},\n\nYou have been selected for the role of ${company.role} at ${company.companyName}.`
    });
};

exports.sendRejectionEmail = async (student, company) => {
    await sendEmail({
        email: student.email,
        subject: `Update on your application at ${company.companyName}`,
        message: `Hello ${student.name},\n\nThank you for taking the time to apply for the role of ${company.role} at ${company.companyName}.\n\nAfter careful consideration, the team has decided not to move forward with your application at this time. We encourage you to keep applying for other opportunities on the placement portal.`
    });
};

exports.sendFeedbackNotification = async (adminEmail, companyName) => {
    await sendEmail({
        email: adminEmail,
        subject: `New Feedback received for ${companyName}`,
        message: `A new feedback has been posted by an Alumni for ${companyName}.`
    });
};

exports.sendOAAlert = async (students, company) => {
    const emails = students.map(s => s.email).join(', ');
    await sendEmail({
        email: emails,
        subject: `OA Alert: Upcoming assessment for ${company.companyName}`,
        message: `This is an alert that the online assessment for ${company.companyName} is approaching.`
    });
};

exports.sendAdminLoginEmail = async (adminDetails) => {
    await sendEmail({
        email: adminDetails.email,
        subject: 'Security Alert: Admin Login Detected',
        message: `Hello ${adminDetails.name},\n\nA successful login was just detected on your Placement Department Admin account. If this was not you, please secure your account immediately.`
    });
};

exports.sendDeadlineAlert = async (students, company) => {
    if (!students || students.length === 0) return;
    const emails = students.map(s => s.email).join(', ');
    await sendEmail({
        email: emails,
        subject: `URGENT: Application closing for ${company.companyName}`,
        message: `Hello,\n\nThis is an automated alert that the application window for ${company.companyName} (${company.role}) is closing in approximately 1 hour! \n\nYou are listed as an eligible match. Please log in to your dashboard immediately to complete your application before the deadline passes.`
    });
};
