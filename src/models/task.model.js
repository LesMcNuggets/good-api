const mongoose = require('mongoose')
const {Schema} = mongoose

const TaskSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  date: {type: Date, default: null},
  tags: [{type: Schema.Types.ObjectId, ref: "Tag"}]
})

module.exports = mongoose.model('Task', TaskSchema)
