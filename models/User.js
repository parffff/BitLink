const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  name: {
    type: String,
    default: '',
  },
  surname: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: -1
  },
  lastSMSCode: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
 
  likedNews: [
    {
      type: Schema.Types.ObjectId,
      ref: "news",
      required: true,
    }
  ],
  role: {
    type: String,
    default: ''
  },
  photos: [
    {
      type: String,
      default: ''
    }
  ],
})

module.exports = mongoose.model('users', userSchema)
