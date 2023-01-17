const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
const pug = require('pug')
const { convert } = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Truong Giai Hung <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async send(template, subject) {
    // 1) Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    )

    // 2) Create mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      html,
    }

    // 3) Create transport and send mail
    if (process.env.NODE_ENV === 'production') {
      await this.newTransport().send(mailOptions)
    } else {
      await this.newTransport().sendMail(mailOptions)
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family!')
  }

  async sendResetPassword() {
    await this.send(
      'password',
      'Your password reset token (valid for only 10 minutes)'
    )
  }
}
