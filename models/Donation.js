const mongoose = require('mongoose');

const Schema = mongoose.Schema

const donationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Donation', donationSchema)