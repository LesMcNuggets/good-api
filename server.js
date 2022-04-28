require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const moment = require('moment');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const json = require('body-parser');
const {PORT} = process.env;

//BDD
const mongoose = require('mongoose')
const {db} = require("./src/config/database.config");
const bodyParser = require("body-parser");
const {getProjects, getProject} = require("./src/controllers/project.controller");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect(`mongodb+srv://${db.user}:${db.password}@${db.host}/${db.database}?retryWrites=true&w=majority`)
  .then(() => {
    require('./src/models')

    io.on('connection', socket => {
      console.log("user connected")
      socket.on('retrieveProjects', (userId) => {
        getProjects(userId).then(myProjects => {
          socket.emit('projectList', myProjects.map(p => ({
            id: p._id,
            title: p.title,
            description: p.description,
            lastUpdate: moment(p.lastUpdate).format('DD/MM/Y à HH:mm')
          })))
        })

      })

      // Récupérer un projet en entier depuis son ID
      socket.on('retrieveProject', (projectId) => {
        if (!projectId) return;
        getProject(projectId).then(myProject => {
          for (const column of myProject.columns) {
            for (let task of column.tasks) task.date = moment(task.date).format('DD/MM/Y')
          }
          socket.emit('projectFromId', myProject)
        })
      })
      // Récupérer les messages en live
      // Envoie d'un message (broadcast)
      // Déplacement d'une tâche
      // Création d'une tâche
      // Modification d'une tâche
      socket.on('disconnect', () => console.log('user disconnected'))
    })

    require('./src/routes/user.routes')(app)
    require('./src/routes/project.routes')(app)


    server.listen(PORT, () => {
      console.log(`Listening on port : ${PORT}`)
    })
  })
// const cors = require('cors');
// console.log(io)
/*app.use(cors({
  origin: '*'
}))*/


