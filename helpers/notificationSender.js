
// const AWS = require("aws-sdk");

const nodemailer = require('nodemailer');


// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-1',
// });

// const ses = new AWS.SES({apiVersion: '2010-12-01'});

// const sendEmail = (to, subject, message, from) => {
//     const params = {
//       Destination: {
//         ToAddresses: [to]
//       },
//       Message: {
//         Body: {
//           Html: {
//             Charset: 'UTF-8',
//             Data: message
//           },
//           Text: {
//             Charset: 'UTF-8',
//             Data: message
//           }
//         },
//         Subject: {
//           Charset: 'UTF-8',
//           Data: subject
//         }
//       },
//       ReturnPath: from ? from : process.env.EMAIL,
//       Source: from ? from : process.env.EMAIL
//     };
  
//     ses.sendEmail(params, (err, data) => {
//       if (err) {
//         console.log(err, err.stack);
//       } else {
//         console.log('Email sent.', data);
//       }
//     });
//   };




const sendEmail = async (to, subject, message) => {

const MAILER_EMAIL = process.env.MAILER_EMAIL || '';
const MAILER_PWD = process.env.MAILER_PWD || '';
const MAILER_USER = process.env.MAILER_USER || '';
const SMTP_PORT = process.env.SMTP_PORT || 25;
const SMTP_HOST = process.env.SMTP_HOST || '';

const from = `${MAILER_USER}<${MAILER_EMAIL}>`;
  

  let emailAccount = {
    user: MAILER_EMAIL,
    pass: MAILER_PWD
};

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: !true, // true for 465, false for other ports
      auth: {
          user: emailAccount.user, // generated ethereal user
          pass: emailAccount.pass, // generated ethereal password
      },
  });


  let mailOptions = {
      from,// sender address
      to, // receiver email
      subject, // Subject line
      html: message // html body
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      console.log("Message response sent: %s", info.response);
  } catch (e) {
      console.log(e)
  }


}



  module.exports = sendEmail;