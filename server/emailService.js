const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendJobApplicationEmail = async (job, userDetails, resumePath, coverLetterPath) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: job.contactEmail || "godsdomain8998@gmail.com",
            subject: `Job Application: ${job.title} at ${job.company}`,
            text: `
        Dear Hiring Manager,

        I am writing to apply for the ${job.title} position at ${job.company}.

        Job Details:
        - Position: ${job.title}
        - Company: ${job.company}
        - Location: ${job.location}
        - Job Type: ${job.employmentType}
        - Date Posted: ${job.datePosted}

        Please find my resume and cover letter attached.

        Best regards,
        ${userDetails.name || userDetails.email}
      `,
            attachments: [
                {
                    filename: 'resume.pdf',
                    path: resumePath
                },
                ...(coverLetterPath ? [{
                    filename: 'cover_letter.pdf',
                    path: coverLetterPath
                }] : [])
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent ${job.contactEmail}', info.response);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { sendJobApplicationEmail };