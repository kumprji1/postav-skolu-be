const path = require('path')

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// Routes
const sharedRoutes = require('./routes/sharedRoutes')
const authRoutes = require('./routes/authRoutes')

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

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Požadavek přijat')
    next();
})

// Adding routes to track
app.use('/api/auth', authRoutes)
app.use('/api', sharedRoutes)

mongoose.connect(MONGODB_URI, {useNewUrlParser: true}).then(() => {
    app.listen(5000)
    // createProjects()
    // createDonatables()
    // createFewLandPiecesO3()
    // createPayment()
}).catch(err => console.log(err))

