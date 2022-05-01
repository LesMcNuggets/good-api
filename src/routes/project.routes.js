const controller = require('../controllers/project.controller')
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Controll-Allow-Headers",
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  });

  app.post(
    '/api/project/create',
    [authJwt.verifyToken],
    controller.createProject
  );
}
