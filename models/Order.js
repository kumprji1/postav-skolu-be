const mongoose = require('mongoose');

const Schema = mongoose.Schema

const orderSchema = new Schema({
    contact: {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        }
    },
    buyingAsCompany: {
        type: Boolean,
        required: true
    },
    wantsCertificate: {
        type: Boolean,
        required: true
    },
    companyInfo: {
        title: {
            type: String,
            required: true
        },
        ico: {
            type: Number,
            required: true
        },
        dic: {
            type: String,
            required: true
        }
    },
    certificateInfo: {
        street_num: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    deliveryMethod: {
        type: String,
        required: true
    },
    products: [{
        type: Number,
        required: false
    }],
    donations: [{
        type: mongoose.Types.ObjectId,
        ref: 'Donation',
        required: false
    }],
    pieces: [{
        type: mongoose.Types.ObjectId,
        ref: 'LandPiece',
        required: false

    }],
    totalAmount: {
        type: Number,
        required: true
    },
    isPurchased: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    purchasedAt: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('Order', orderSchema)