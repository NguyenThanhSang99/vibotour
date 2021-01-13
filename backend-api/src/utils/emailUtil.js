import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

function sendEmail(subject, content, receiverEmail) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailOption = {
    from: process.env.EMAIL, // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    html: content, // plain text body
    attachDataUrls: true,
  };

  transporter.sendMail(mailOption, function (err, data) {
    if (err) {
      return "error";
    } else {
      return "success";
    }
  });
}

function parse(str) {
  var args = [].slice.call(arguments, 1),
    i = 0;
  return str.replace(/%s/g, () => args[i++]);
}

export { sendEmail, parse };
