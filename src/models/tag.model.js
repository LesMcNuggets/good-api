const mongoose = require('mongoose')
const {Schema} = mongoose

const TagSchema = new Schema({
  content: {type: String, required: true},
  color: {type: String, default: '#fff'},
})

module.exports = mongoose.model('Tag', TagSchema)
