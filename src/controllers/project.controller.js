const mongoose = require("mongoose");
Project = require('../models/project.model')
Column = require('../models/column.model')

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

exports.getProject = async (projectId) => Project.findOne({_id: projectId})
  .populate([
      {
        path: 'columns',
        model: 'Column',
        populate: {
          path: 'tasks',
          populate: {
            path: 'tags'
          }
        }
      },
      {path: 'usersId', select: ['id', 'email']},
      {path: 'tags'},
    ]
  )
