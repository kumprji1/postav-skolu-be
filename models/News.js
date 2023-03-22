const mongoose = require('mongoose');

const Schema = mongoose.Schema

const newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    deleted: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('News', newsSchema)