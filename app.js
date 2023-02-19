const path = require('path')

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// Routes
const sharedRoutes = require('./routes/sharedRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')

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

// Enabling access to body of requests
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Požadavek přijat')
    next();
})

// Adding routes to track
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

