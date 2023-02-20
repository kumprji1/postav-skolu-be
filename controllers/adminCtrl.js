const Donatable = require("../models/Donatable");
const Project = require("../models/Project");

const HttpError = require('../models/HttpError')

// const { validationResult } = require("express-validator");

// const checkErrors = () => {};

// Projects

exports.postCreateProject = async (req, res, next) => {
  try {
    await new Project({
      title: req.body.title,
      desc: req.body.desc,
      type: 'donate',
      urlTitle: req.body.urlTitle,
      photo: req.body.photo,
      deleted: false
    }).save()
    res.json({msg: 'OK'})
  } catch (err) {
    return next(new HttpError('Nepodařilo se vytvořit projekt', 500))
  }
}

exports.patchEditProject = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return next(new HttpError(errors.errors[0].msg, 500));
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, {
      title: req.body.title,
      desc: req.body.desc,
      urlTitle: req.body.urlTitle,
      photo: req.body.photo
    });
    res.json({ msg: "OK", project: updatedProject });
  } catch (err) {
    return next(new HttpError("Nepodařilo se aktualizovat projekt", 500));
  }
};

// Donatables 

exports.postCreateDonatable = async (req, res, next) => {
  try {
    await new Donatable({
      title: req.body.title,
      desc: req.body.desc,
      earnedMoney: 0,
      demandedMoney: req.body.demandedMoney,
      preparedPrices: [100, 200, 500],
      photo: req.body.photo,
      deleted: false,
      projectId: req.params.projectId
    }).save()
    res.json({msg: 'OK'})
  } catch (err) {
    return next(new HttpError('Nepodařilo se vytvořit darovatelný box', 500))
  }
}

