const mongoose = require('mongoose');

const Schema = mongoose.Schema

const landPieceSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    usersText: {
        type: String,
        required: false
    },
    isAnonymous: {
        type: Boolean,
        required: false
    },
    isBought: {
        type: Boolean,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    edges: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('LandPiece', landPieceSchema)