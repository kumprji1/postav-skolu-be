const Project = require('../models/Project')

exports.getProjectByCategory = (req, res, next) => {
    const { category } = req.params
    console.log(category)
    Project.find({category: category})
    .then((projects) => {
        res.json(projects)
    })
    .catch(err => console.log(err))
}