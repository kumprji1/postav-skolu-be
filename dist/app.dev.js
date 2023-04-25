"use strict";

var path = require('path');

var express = require('express');

var mongoose = require('mongoose');

var bodyParser = require('body-parser'); // Routes


var sharedRoutes = require('./routes/sharedRoutes');

var authRoutes = require('./routes/authRoutes');

var adminRoutes = require('./routes/adminRoutes');

var userRoutes = require('./routes/userRoutes'); // Security


var helmet = require('helmet');

var cors = require('cors'); // Stripe stuff


var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // cd C:\Users\gorto\Downloads\stripe_1.13.12_windows_x86_64
// stripe listen --forward-to localhost:5000/webhook


var endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

var Order = require('./models/Order'); // Enabling .env variables


require('dotenv').config();

var _require = require('./scripts/data-init'),
    createProjects = _require.createProjects,
    createFewLandPiecesO3 = _require.createFewLandPiecesO3,
    createPayment = _require.createPayment,
    createDonatables = _require.createDonatables,
    updateProjectDeletedFalse = _require.updateProjectDeletedFalse,
    updateDonatables_setEarnedZeroMoney = _require.updateDonatables_setEarnedZeroMoney;

var Donation = require('./models/Donation');

var Donatable = require('./models/Donatable');

var _require2 = require('./utils/pdf_service'),
    testPDFCreation = _require2.testPDFCreation;

var _require3 = require('./utils/mail_service'),
    sendTestEmail = _require3.sendTestEmail,
    sendEmail_OrderPurchasedAndBill = _require3.sendEmail_OrderPurchasedAndBill;

var MONGODB_URI = "mongodb+srv://".concat(process.env.DB_USER, ":").concat(process.env.DB_PASSWD, "@cluster0.orv11.mongodb.net/").concat(process.env.DB_NAME, "?retryWrites=true&w=majority");
var app = express(); // Security conf
// app.use(helmet())
// let whitelist = ['http://localhost:3000', 'http://localhost:5000', 'https://postav-skolu.herokuapp.com/'];
// var corsOptionsDelegate = function(req, callback){
//   var corsOptions;
//   if(whitelist.indexOf(req.header('Origin')) !== -1){
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   }else{
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };
// app.use(cors(corsOptionsDelegate))
// Cors

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
}); // Enable static serving from public folder

app.use(express["static"](path.join('public'))); // Stripe Listener

app.post('/webhook', bodyParser.raw({
  type: 'application/json'
}), function _callee(request, response) {
  var payload, sig, event, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Objednávka zaplacena');
          payload = request.body;
          sig = request.headers['stripe-signature'];
          _context.prev = 3;
          event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](3);
          console.log("Webhook Error: ".concat(_context.t0.message));
          return _context.abrupt("return", response.status(400).send("Webhook Error: ".concat(_context.t0.message)));

        case 11:
          // Handle the checkout.session.completed event
          if (event.type === 'checkout.session.completed') {
            console.log('checkout.session.completed'); // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.

            session = event.data.object; // Fulfill the purchase...
            // Pro testovací účely je objednávka nastavená jako zaplacená ihned po vytvoření, násleudjící zakomentovaný kód by se provedl při ostrém nasazení
            // const orderId = session.success_url.split('/')[4].split('?')[0].trim()
            // console.log('set this order and its donations as purchased: ', orderId)
            // const sessionDB = await mongoose.startSession()
            // sessionDB.startTransaction()
            // try {
            //   const order = await Order.findOneAndUpdate({_id: orderId}, {isPurchased: true, purchasedAt: new Date()})
            //   if (!order) {
            //     await sessionDB.abortTransaction()
            //     throw new Error('Transakce se nezdařila')
            //   }
            //   for (const donationId of order.donations) {
            //     // If it's already bought
            //     const don = await Donation.findByIdAndUpdate(
            //       { _id: donationId },
            //       { $set: { isPurchased: true } }
            //     );
            //     const donatable = await Donatable.updateOne({_id: don.donatableId}, { $inc: { earnedMoney: don.price } })
            //     if (!don || ! donatable) {
            //       await sessionDB.abortTransaction()
            //       throw new Error('Transakce se nezdařila')
            //     }
            //   }
            //   await sessionDB.commitTransaction()
            //   sendEmail_OrderPurchasedAndBill(order.contact.email, {orderId: order._id})
            // } catch (error) {
            //   await sessionDB.abortTransaction()
            //   console.log(error)
            // } finally {
            //   sessionDB.endSession()
            // }
          }

          response.status(200).end();

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 7]]);
}); // Enabling access to body of requests

app.use(bodyParser.json()); // Adding routes to track
// app.use('/webhook', stripeRoutes)

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api', sharedRoutes); // Serving react app

app.use(function (req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
}); // Handeling errors

app.use(function (error, req, res, next) {
  console.log(error);

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({
    msg: error.message || 'Nastala neznámá chyba'
  });
}); // Database conn

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
}).then(function () {
  app.listen(process.env.PORT); // createProjects()
  // createDonatables()
  // createFewLandPiecesO3()
  // createPayment()
  // testPDFCreation()
  // sendTestEmail();
  // updateProjectDeletedFalse()
  // updateDonatables_setEarnedZeroMoney()
})["catch"](function (err) {
  return console.log(err);
});