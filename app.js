const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config();

const { createProjects } = require('./scripts/data-init')

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.orv11.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use((req, res, next) => {
    console.log('Požadavek přijat')
    next();
})

mongoose.connect(MONGODB_URI, {useNewUrlParser: true}).then(() => {
    app.listen(5000)
    // createProjects()
}).catch(err => console.log(err))

