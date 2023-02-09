const mongoose = require('mongoose');

const Schema = mongoose.Schema

const donationSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },    
    purchasedAt: {
        type: Date,
        required: false
    },
    isPurchased: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Donation', donationSchema)