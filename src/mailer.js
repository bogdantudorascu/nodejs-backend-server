import nodemailer from "nodemailer";
import {HOST} from "./constants";
const from = '"Localhost" <info@localhost:8080>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export function sendConfirmationEmail(user) {
  const transporter = setup();
  const mailOptions = {
    from,
    to: user.email,
    subject: "Welcome",
    text: `
    Welcome. Please, confirm your email.

    ${HOST}/confirmation/${user.confirmationToken}
    `
  };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

export function sendResetPasswordEmail(user) {
  console.log(user.email)
  const transporter = setup();
  const mailOptions = {
    from,
    to: user.email,
    subject: "Reset Password",
    text: `
    To reset password follow this link

    ${HOST}/reset_password/${user.resetPasswordToken}
    `
  };

  // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}
