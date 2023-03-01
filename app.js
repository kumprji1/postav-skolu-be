const path = require('path')

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// Routes
const sharedRoutes = require('./routes/sharedRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const stripeRoutes = require('./routes/stripeRoutes')

// Stripe stuff
const stripe = require('stripe')(process.env.STRIPE_KEY)
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;


// Enabling .env variables
require('dotenv').config();

const { createProjects, createFewLandPiecesO3, createPayment, createDonatables } = require('./scripts/data-init')

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.orv11.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

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
    const session = await stripe.checkout.sessions.retrieve(
      session.id
    );

    // Fulfill the purchase...
    console.log('Fulfill', session)
  }
  
    response.status(200).end();
  });


// Enabling access to body of requests
// app.use(bodyParser.json());
app.use(express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
}));

app.use((req, res, next) => {
    console.log('Požadavek přijat')
    next();
})

// Adding routes to track
// app.use('/webhook', stripeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', sharedRoutes)

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
    app.listen(5000)
    // createProjects()
    // createDonatables()
    // createFewLandPiecesO3()
    // createPayment()
}).catch(err => console.log(err))

