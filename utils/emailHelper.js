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
      <p>Klik link berikut untuk mengatur ulang password kamu:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link ini akan kadaluarsa dalam 15 menit.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
