const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
    },
});

const sendResetPasswordEmail = async (to, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to,
        subject: "Reset Password",
        html: `
      <p>Halo,</p>
      <p>Click the following link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
