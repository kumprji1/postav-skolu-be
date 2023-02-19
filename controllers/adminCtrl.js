const Project = require("../models/Project");

// const { validationResult } = require("express-validator");

// const checkErrors = () => {};

// Projects

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
