const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'larry66@ethereal.email',
                pass: 'KpbA6Vz6XA8qf4jNes'
            }
        });

        const mailOptions = {
            from: `"Your App" <garnett58@ethereal.email>`, 
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

module.exports = sendEmail;
