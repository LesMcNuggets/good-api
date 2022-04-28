const mongoose = require('mongoose')
const {Schema} = mongoose

const ColumnSchema = new Schema({
  title: {type: String, required: true},
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
})

module.exports = mongoose.model('Column', ColumnSchema)
