const mongoose = require('mongoose')
const {Schema} = mongoose
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const UserSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'invalid email'],
    createIndexes: {unique: true},
    unique: true,
    dropDups: true
  },
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  password: {type: String, required: true},
})

UserSchema.pre('save', function (next) {
  let user = this

  if (!user.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = (candidatePassword, userPassword, callback) => {
  bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
