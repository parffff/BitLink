const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true,
    }],

    likesCount: {
        type: Number,
        default: 0
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        text: {
            type: String,
            required: true
        },

    }],
    datetime: {
        type: String,
        default: ''
    }

})

module.exports = mongoose.model('news', newsSchema)
