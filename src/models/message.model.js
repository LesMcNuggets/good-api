const mongoose = require('mongoose')
const {Schema} = mongoose

const MessageSchema = new Schema({
  content: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  sendDate: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Message', MessageSchema)
