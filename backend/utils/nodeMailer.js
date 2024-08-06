import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user:'aceinterviews8@gmail.com',
    pass: 'lgjznlxcfdkfkdbw'

  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
