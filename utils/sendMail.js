const nodemailer = require('nodemailer')

const sendMail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  // 2) Define email options
  const mailOptions = {
    from: 'Trương Giai Hưng <hunggiaitruong288@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  }
  // 3) Send the mail
  await transporter.sendMail(mailOptions)
}

module.exports = sendMail
