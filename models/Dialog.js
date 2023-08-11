const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dialogSchema = Schema({
    firstMember: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    secondMember: {
        type: String,
        default: 'admin'
    },
    lastMessageTime: {
        type: String,
        default: '2010-10-20 4:30:59',
        required: true
    },
    isNotReadedCount: {
        type: Number,
        default: 0,
        required: true
    },
    lastSender: {
        type: String,
        default: '',
        required: true
    },
    lastSender: {
        type: String,
        default: '',
        required: true
    },
    lastMessageType: {
        type: String,
        default: '',
        required: true
    },
    messages: [
        {
            type: {
                type: String,
                required: true,
            },
            from: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true
            },
            pickedImages: [
                {
                    type: String,
                    required: true
                }
            ],
            pickedVoice: {
                type: String,
                default: ''
            },
            repliedOn: {
                type: Schema.Types.ObjectId,
                ref: "dialogs",
                required: false
            },
            datetime: {
                type: String,
                required: true
            }
        }
    ],


})

module.exports = mongoose.model('dialogs', dialogSchema)
