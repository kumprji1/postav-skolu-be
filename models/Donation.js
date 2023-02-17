const mongoose = require('mongoose');

const Schema = mongoose.Schema

const donationSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    donatableId: {
        type: mongoose.Types.ObjectId,
        ref: 'Donatable',
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
    },
    isAnonymous: {
        type: Boolean,
        required: true
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        required: false
    },
    name: {
        type: String,
        required: false
    },
    // For LandPieces (voluntary)
    note: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('Donation', donationSchema)