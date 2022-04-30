const mongoose = require('mongoose')
const {Schema} = mongoose

const ProjectSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, default: ""},
  columns: [{type: Schema.Types.ObjectId, ref: "Column"}],
  usersId: [{type: Schema.Types.ObjectId, ref: "User"}],
  messages: [{type: Schema.Types.ObjectId, ref: "Message"}],
  tags: [{type: Schema.Types.ObjectId, ref: "Tag"}],
  lastUpdate: {type: Date, default: Date.now}
})

ProjectSchema.pre('save', (next) => {
  this.lastUpdate = Date.now()
  return next()
})

module.exports = mongoose.model('Project', ProjectSchema)
