const jwt = require("jsonwebtoken");
const config = require('../config/auth.config')
User = require('../models/user.model')

/*const Admin = new User({
  email: 'admin@test.com',
  password: 'ProjetMDS2022'
})
Admin.save((err) => {
  if (err) throw err;
})*/
exports.signup = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
    res.status(401).send('Please send the correct informations')
  }

  const {email, password, firstname, lastname} = req.body
  const userToCreate = new User({
    email,
    password,
    firstname,
    lastname
  })
  userToCreate.save((err) => {
    if (err) {
      if (err.code !== 11000) res.status(401).send(err)
    }
    this.signin(req, res)
  })
}

exports.signin = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(401).send('Please send the correct informations')
  }

  const {email, password} = req.body
  User.findOne({email}, (err, user) => {
    if (err) throw err

    user.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        let token = jwt.sign({id: user._id}, config.jwtSecret, {expiresIn: 86400})

        res.status(200).send({
          id: user._id,
          accessToken: token
        })
      } else {
        res.status(404).send("We don't know that user")
      }
    })
  })
}

exports.check = (req, res) => {
  res.status(200).send("coin!")
}
