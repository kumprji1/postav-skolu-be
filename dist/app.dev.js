"use strict";

var path = require('path');

var express = require('express');

var mongoose = require('mongoose');

var bodyParser = require('body-parser'); // Routes


var sharedRoutes = require('./routes/sharedRoutes');

var authRoutes = require('./routes/authRoutes');

var adminRoutes = require('./routes/adminRoutes');

var userRoutes = require('./routes/userRoutes'); // Stripe stuff


var stripe = require('stripe')(process.env.STRIPE_KEY); // cd C:\Users\gorto\Downloads\stripe_1.13.12_windows_x86_64
// stripe listen --forward-to localhost:5000/webhook


var endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

var Order = require('./models/Order'); // Enabling .env variables


require('dotenv').config();

var _require = require('./scripts/data-init'),
    createProjects = _require.createProjects,
    createFewLandPiecesO3 = _require.createFewLandPiecesO3,
    createPayment = _require.createPayment,
    createDonatables = _require.createDonatables,
    updateProjectDeletedFalse = _require.updateProjectDeletedFalse;

var Donation = require('./models/Donation');

var Donatable = require('./models/Donatable');

var _require2 = require('./utils/pdf_service'),
    testPDFCreation = _require2.testPDFCreation;

var _require3 = require('./utils/mail_service'),
    sendTestEmail = _require3.sendTestEmail,
    sendEmail_OrderPurchasedAndBill = _require3.sendEmail_OrderPurchasedAndBill;

var MONGODB_URI = "mongodb+srv://".concat(process.env.DB_USER, ":").concat(process.env.DB_PASSWD, "@cluster0.orv11.mongodb.net/").concat(process.env.DB_NAME, "?retryWrites=true&w=majority");
var app = express(); // Cors

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
  var payload, sig, event, session, orderId, sessionDB, order, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, donationId, don, donatable;

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
          if (!(event.type === 'checkout.session.completed')) {
            _context.next = 75;
            break;
          }

          console.log('checkout.session.completed'); // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.

          session = event.data.object; // Fulfill the purchase...

          orderId = session.success_url.split('/')[4].split('?')[0].trim();
          console.log('set this order and its donations as purchased: ', orderId);
          _context.next = 18;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 18:
          sessionDB = _context.sent;
          sessionDB.startTransaction();
          _context.prev = 20;
          _context.next = 23;
          return regeneratorRuntime.awrap(Order.findOneAndUpdate({
            _id: orderId
          }, {
            isPurchased: true,
            purchasedAt: new Date()
          }));

        case 23:
          order = _context.sent;

          if (order) {
            _context.next = 28;
            break;
          }

          _context.next = 27;
          return regeneratorRuntime.awrap(sessionDB.abortTransaction());

        case 27:
          throw new Error('Transakce se nezdařila');

        case 28:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 31;
          _iterator = order.donations[Symbol.iterator]();

        case 33:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 48;
            break;
          }

          donationId = _step.value;
          _context.next = 37;
          return regeneratorRuntime.awrap(Donation.findByIdAndUpdate({
            _id: donationId
          }, {
            $set: {
              isPurchased: true
            }
          }));

        case 37:
          don = _context.sent;
          _context.next = 40;
          return regeneratorRuntime.awrap(Donatable.updateOne({
            _id: don.donatableId
          }, {
            $inc: {
              earnedMoney: don.price
            }
          }));

        case 40:
          donatable = _context.sent;

          if (!(!don || !donatable)) {
            _context.next = 45;
            break;
          }

          _context.next = 44;
          return regeneratorRuntime.awrap(sessionDB.abortTransaction());

        case 44:
          throw new Error('Transakce se nezdařila');

        case 45:
          _iteratorNormalCompletion = true;
          _context.next = 33;
          break;

        case 48:
          _context.next = 54;
          break;

        case 50:
          _context.prev = 50;
          _context.t1 = _context["catch"](31);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 54:
          _context.prev = 54;
          _context.prev = 55;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 57:
          _context.prev = 57;

          if (!_didIteratorError) {
            _context.next = 60;
            break;
          }

          throw _iteratorError;

        case 60:
          return _context.finish(57);

        case 61:
          return _context.finish(54);

        case 62:
          _context.next = 64;
          return regeneratorRuntime.awrap(sessionDB.commitTransaction());

        case 64:
          sendEmail_OrderPurchasedAndBill(order.contact.email, {
            orderId: order._id
          });
          _context.next = 72;
          break;

        case 67:
          _context.prev = 67;
          _context.t2 = _context["catch"](20);
          _context.next = 71;
          return regeneratorRuntime.awrap(sessionDB.abortTransaction());

        case 71:
          console.log(_context.t2);

        case 72:
          _context.prev = 72;
          sessionDB.endSession();
          return _context.finish(72);

        case 75:
          response.status(200).end();

        case 76:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 7], [20, 67, 72, 75], [31, 50, 54, 62], [55,, 57, 61]]);
}); // Enabling access to body of requests

app.use(bodyParser.json()); // app.use(express.json({
//     limit: '5mb',
//     verify: (req, res, buf) => {
//       req.rawBody = buf.toString();
//     }
// }));

app.use(function (req, res, next) {
  console.log('Požadavek přijat');
  next();
}); // Adding routes to track
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
  app.listen(5000); // createProjects()
  // createDonatables()
  // createFewLandPiecesO3()
  // createPayment()
  // testPDFCreation()
  // sendTestEmail();
  // updateProjectDeletedFalse()
})["catch"](function (err) {
  return console.log(err);
});