const path = require('path')

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// Routes
const sharedRoutes = require('./routes/sharedRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')

// Security
const helmet = require('helmet')
const cors = require('cors')

// Stripe stuff
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// cd C:\Users\gorto\Downloads\stripe_1.13.12_windows_x86_64
// stripe listen --forward-to localhost:5000/webhook
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


const Order = require('./models/Order');


// Enabling .env variables
require('dotenv').config();

const { createProjects, createFewLandPiecesO3, createPayment, createDonatables, updateProjectDeletedFalse, updateDonatables_setEarnedZeroMoney } = require('./scripts/data-init');
const Donation = require('./models/Donation');
const Donatable = require('./models/Donatable');
const { testPDFCreation } = require('./utils/pdf_service');
const { sendTestEmail, sendEmail_OrderPurchasedAndBill } = require('./utils/mail_service');

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.orv11.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

// Security conf
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
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

// Enable static serving from public folder
app.use(express.static(path.join('public')))


// Stripe Listener
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
    console.log('Objednávka zaplacena')
    const payload = request.body;
    console.log('paylaod: ', payload)
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`)
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    console.log('checkout.session.completed')
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const session = event.data.object;

    // Fulfill the purchase...
    // Pro testovací účely je objednávka nastavená jako zaplacená ihned po vytvoření, násleudjící zakomentovaný kód by se provedl při ostrém nasazení

	const orderId = session.success_url.split('/')[4].split('?')[0].trim()
	console.log('set this order and its donations as purchased: ', orderId)

  const sessionDB = await mongoose.startSession()
  sessionDB.startTransaction()
  try {
    const order = await Order.findOneAndUpdate({_id: orderId}, {isPurchased: true, purchasedAt: new Date()})
    if (!order) {
      await sessionDB.abortTransaction()
      throw new Error('Transakce se nezdařila')
    }
    for (const donationId of order.donations) {
      // If it's already bought
      const don = await Donation.findByIdAndUpdate(
        { _id: donationId },
        { $set: { isPurchased: true } }
      );
      const donatable = await Donatable.updateOne({_id: don.donatableId}, { $inc: { earnedMoney: don.price } })
      if (!don || ! donatable) {
        await sessionDB.abortTransaction()
        throw new Error('Transakce se nezdařila')
      }
    }
    await sessionDB.commitTransaction()
    sendEmail_OrderPurchasedAndBill(order.contact.email, {orderId: order._id})
  } catch (error) {
    await sessionDB.abortTransaction()
    console.log(error)
  } finally {
    sessionDB.endSession()
  }
  
  }
    response.status(200).end();
  });


// Enabling access to body of requests
app.use(bodyParser.json());

// Adding routes to track
// app.use('/webhook', stripeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)
app.use('/api', sharedRoutes)

// Serving react app
app.use((req, res) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

// Handeling errors
app.use((error, req, res, next) => {
	console.log(error);
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ msg: error.message || 'Nastala neznámá chyba' });
});


// Database conn
mongoose.connect(MONGODB_URI, {useNewUrlParser: true}).then(() => {
    app.listen(process.env.PORT)
    // createProjects()
    // createDonatables()
    // createFewLandPiecesO3()
    // createPayment()
    // testPDFCreation()
    // sendTestEmail();
    // updateProjectDeletedFalse()
    // updateDonatables_setEarnedZeroMoney()
}).catch(err => console.log(err))

