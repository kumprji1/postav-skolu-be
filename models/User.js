const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    orderedProducts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: false
    }],
    deliveredProducts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: false
    }]
})

module.exports = mongoose.model('User', userSchema)