const mongoose = require('mongoose');

const Schema = mongoose.Schema

const donatableSchema = new Schema({
    title: {
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
    demandedMoney: {
        type: Number,
        required: true
    },
    preparedPrices: [{
        type: Number,
        required: false
    }],
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: true
    }
})

module.exports = mongoose.model('Donatable', donatableSchema)