const nodemailer = require("nodemailer");
require("dotenv");

exports.sendTestEmail = () => {
  // Vytvoření přepravce
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 587,
    // secure: false, // true pro 465, false pro ostatní porty
    auth: {
      user: "postavskolu@gmail.com", // email odesílatele
      pass: process.env.EMAIL_PASS, // heslo odesílatele
    },
  });

  // Nastavení obsahu emailu
  let mailOptions = {
    from: "postavskolu@gmail.com",
    to: "gortozcze@gmail.com",
    subject: "Předmět emailu",
    text: "Text emailu",
  };

  // Odeslání emailu
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email odeslán: " + info.response);
    }
  });
};
