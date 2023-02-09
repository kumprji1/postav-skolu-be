const mongoose = require('mongoose');

const Schema = mongoose.Schema

const projectSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    urlTitle: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    earnedMoney: {
        type: Number,
        required: true
    },
    maxMoney: {
        type: Number,
        required: true
    },
    preparedPrices: [{
        type: Number,
        required: false
    }],
    products: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: false
    }]
})

module.exports = mongoose.model('Project', projectSchema)