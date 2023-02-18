const mongoose = require('mongoose');

const Schema = mongoose.Schema

const projectSchema = new Schema({
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
    deleted: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('Project', projectSchema)