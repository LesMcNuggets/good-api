const controller = require('../controllers/user.controller')
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      'x-access-token, Origin, Content-Type, Accept',
    );
    res.header("Access-Control-Allow-Origin", "*")
    next()
  })

  app.post('/api/signup', controller.signup)
  app.post('/api/signin', controller.signin)
  app.get(
    '/api/check_token_validity',
    [authJwt.verifyToken],
    controller.check
  )
}
