const mongoose = require("mongoose");
Project = require('../models/project.model')
Column = require('../models/column.model')
Task = require('../models/task.model')
Message = require('../models/message.model')

exports.createProject = (req, res) => {
  if (!req.body.title) {
    res.status(401).send('Please enter a title')
  }

  const firstColumn = new Column({
    title: "TODO"
  })
  firstColumn.save().then(column => {
    const {title} = req.body
    const description = req.body.description ?? ""
    const projectToCreate = new Project({
      title,
      description,
      usersId: [req.userId],
      columns: [column._id]
    });
    projectToCreate.save((err) => {
      if (err) {
        res.status(401).send(err)
      }
      res.status(200).send(`Project ${title} created !`)
    });
  })
};

exports.getProjects = async (userId) => {
  return Project.find({usersId: userId}).sort({lastUpdate: -1}).populate('usersId', ['id', 'email']);
};

exports.getProject = async (projectId, dataGotModifed = false) => {
  if (dataGotModifed) {
    let newDate = Date.now()
    await Project.findOneAndUpdate({_id: projectId}, {$set: {lastUpdate: newDate}})
  }
  return Project.findOne({_id: projectId})
    .populate([
        {
          path: 'columns',
          model: 'Column',
          populate: {
            path: 'tasks',
            populate: [{path: 'tags'}, {path: 'usersId', select: ['_id', 'email', 'firstname', 'lastname']}]
          }
        },
        {path: 'usersId', select: ['_id', 'email', 'firstname', 'lastname']},
        {path: 'tags'},
        {
          path: 'messages',
          populate: [{path: 'user', select: ['_id', 'firstname', 'lastname']}]
        },
      ]
    )
}

exports.addColumnToProject = (id, columnName) => {
  const column = new Column({
    title: columnName
  })
  return column.save().then(col => {
    return Project.findOneAndUpdate({_id: id}, {$push: {columns: col}})
      .then(() => true)
      .catch(() => false)
  })
}

exports.addTaskToColumn = (columnId, taskName) => {
  const task = new Task({
    title: taskName
  })
  return task.save().then(t => {
    return Column.findOneAndUpdate({_id: columnId}, {$push: {tasks: t}})
      .then(() => true)
      .catch(() => false)
  })
}

exports.modifyProject = (project) => {
  let promises = project.columns.map(c => new Promise((resolve, reject) => {
    Column.updateOne({_id: c._id}, {$set: {tasks: c.tasks}})
      .then(() => resolve())
      .catch((e) => reject(e))
  }))
  return Promise.all(promises)
    .then(() => true)
    .catch(() => false)
}

exports.modifyTask = (task) => {
  return Task.updateOne({_id: task._id}, {
    $set: {
      title: task.title,
      description: task.description,
      date: task.date,
      tags: task.tags,
      usersId: task.usersId,
    },
  }).then(() => true).catch(() => false)
}

exports.sendMessage = (idProject, message) => {
  const newMessage = new Message({
    content: message.content,
    user: message.user,
  })
  return newMessage.save().then(msg => {
    return Project.findOneAndUpdate({_id: idProject}, {
      $push: {messages: msg},
    }).then(() => true).catch(() => false)
  }).catch(() => false)
}
