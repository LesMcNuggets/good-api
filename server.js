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
const {
  getProjects,
  getProject,
  addColumnToProject,
  addTaskToColumn,
  modifyProject
} = require("./src/controllers/project.controller");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect(`mongodb+srv://${db.user}:${db.password}@${db.host}/${db.database}?retryWrites=true&w=majority`)
  .then(() => {
    require('./src/models')

    io.on('connection', socket => {
      console.log("user connected")
      socket.on('joinRoom', projectId => {
        socket.join(projectId.toString())
        console.log('User joined room ', projectId.toString())
      })
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

      socket.on('addColumnToProject', (projectId, newColumnName) => {
        if (!projectId || !newColumnName) return;
        addColumnToProject(projectId, newColumnName).then(status => {
          if (status) {
            getProject(projectId).then(myProject => {
              for (const column of myProject.columns) {
                for (let task of column.tasks) task.date = moment(task.date).format('DD/MM/Y')
              }
              io.to(projectId.toString()).emit('projectFromId', myProject)
            })
          }
        })
      })

      socket.on('addTaskToColumn', (projectId, columnId, taskName) => {
        if (!columnId || !taskName) return;
        addTaskToColumn(columnId, taskName).then(status => {
          if (status) {
            getProject(projectId).then(myProject => {
              for (const column of myProject.columns) {
                for (let task of column.tasks) task.date = moment(task.date).format('DD/MM/Y')
              }
              io.to(projectId.toString()).emit('projectFromId', myProject)
            })
          }
        })
      })

      socket.on('modifyWholeProject', (project) => {
        project.columns.forEach(c => {
          c.tasks.map(t => console.log(t))
        })
        modifyProject(project).then(status => {
          if (status) {
            getProject(project._id).then(myProject => {
              for (const column of myProject.columns) {
                for (let task of column.tasks) task.date = moment(task.date).format('DD/MM/Y')
              }
              io.to(project._id.toString()).emit('projectFromId', myProject)
            })
          }
        })
      })
      // Récupérer les messages en live
      // Envoie d'un message (broadcast)
      // Déplacement d'une tâche
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


