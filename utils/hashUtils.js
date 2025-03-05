const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const saltRounds = 10;

const hashPassword = (password) => bcrypt.hash(password, saltRounds);
const generateVerificationCode = () => crypto.randomInt(100000, 999999).toString();

const sendVerificationEmail = (email, verificationCode) => {
    console.log(`Send verification email to ${email} with code: ${verificationCode}`);
};

module.exports = { hashPassword, generateVerificationCode, sendVerificationEmail };