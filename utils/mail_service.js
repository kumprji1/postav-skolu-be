const nodemailer = require("nodemailer");
require("dotenv").config();
let transporter = nodemailer.createTransport({
  service: 'gmail',
  // port: 587,
  // secure: false, // true pro 465, false pro ostatní porty
  auth: {
    user: "postavskolu@gmail.com", // email odesílatele
    pass: process.env.EMAIL_PASS, // heslo odesílatele
  },
});

exports.sendTestEmail = () => {
  // Vytvoření přepravce

  // Nastavení obsahu emailu
  let mailOptions = {
    from: "postavskolu@gmail.com",
    to: "gortozcze@gmail.com",
    subject: "Předmět emailu",
    text: "Text emailu",
    attachments: [
    {   // filename and content type is derived from path
        path: './pdf/outputs/output.pdf'
    },
    ]
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

exports.sendEmail_OrderCreated = (to, data) => {
  // Vytvoření přepravce

  // Nastavení obsahu emailu
  let mailOptions = {
    from: "postavskolu@gmail.com",
    to: to,
    subject: "Objednávka vytvořena",
    text: `Děkujeme za vytvoření objednávky`,
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

exports.sendEmail_OrderPurchasedAndBill = (to, data) => {
  // Vytvoření přepravce

  // Nastavení obsahu emailu
  let mailOptions = {
    from: "postavskolu@gmail.com",
    to: to,
    subject: "Objednávka zaplacena",
    text: `Děkujeme za zaplacení objednávky. V příloze je zaslána faktura`,
    attachments: [
      {   // filename and content type is derived from path
          path: `./pdf/outputs/faktura_postavskolu_${data.orderId}.pdf`
      },
    ]
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