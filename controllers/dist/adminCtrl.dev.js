"use strict";

var Donatable = require("../models/Donatable");

var Project = require("../models/Project");

var News = require("../models/News");

var HttpError = require('../models/HttpError'); // const { validationResult } = require("express-validator");
// const checkErrors = () => {};
// Projects


exports.postCreateProject = function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Project({
            title: req.body.title,
            desc: req.body.desc,
            type: 'donate',
            urlTitle: req.body.urlTitle,
            photo: req.body.photo,
            deleted: false
          }).save());

        case 3:
          res.json({
            msg: 'OK'
          });
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", next(new HttpError('Nepodařilo se vytvořit projekt', 500)));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.patchEditProject = function _callee2(req, res, next) {
  var updatedProject;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Project.findByIdAndUpdate(req.params.projectId, {
            title: req.body.title,
            desc: req.body.desc,
            urlTitle: req.body.urlTitle,
            photo: req.body.photo
          }));

        case 3:
          updatedProject = _context2.sent;
          res.json({
            msg: "OK",
            project: updatedProject
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se aktualizovat projekt", 500)));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.patchSetProjectDeleted = function (req, res, next) {
  var projectId = req.params.projectId;
  Project.findOneAndUpdate({
    _id: projectId
  }, {
    deleted: true
  }).then(function (project) {
    res.json({
      msg: 'ok'
    });
  })["catch"](function (err) {
    return next(new HttpError('Nepodařilo se odstranit projekt', 500));
  });
}; // News


exports.postCreateNews = function _callee3(req, res, next) {
  var projectExists;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Project.exists({
            urlTitle: req.params.urlTitle
          }));

        case 3:
          projectExists = _context3.sent;

          if (projectExists) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", next(new HttpError('Projekt, ke kterému chcete vytvořit aktualitu, neexistuje', 500)));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(new News({
            title: req.body.title,
            text: req.body.text,
            createdAt: new Date(),
            projectId: projectExists._id,
            deleted: false
          }).save());

        case 8:
          res.json({
            msg: 'OK'
          });
          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", next(new HttpError('Nepodařilo se vytvořit aktualitu', 500)));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.patchSetNewsDeleted = function (req, res, next) {
  var newsId = req.params.newsId;
  News.findOneAndUpdate({
    _id: newsId
  }, {
    deleted: true
  }).then(function (news) {
    res.json({
      msg: 'ok'
    });
  })["catch"](function (err) {
    return next(new HttpError('Nepodařilo se odstranit aktualitu', 500));
  });
};

exports.patchEditNews = function _callee4(req, res, next) {
  var updatedNews;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(News.findByIdAndUpdate(req.params.newsId, {
            title: req.body.title,
            text: req.body.text
          }));

        case 3:
          updatedNews = _context4.sent;
          res.json({
            msg: "OK",
            news: updatedNews
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", next(new HttpError("Nepodařilo se aktualizovat aktualitu", 500)));

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Donatables 


exports.postCreateDonatable = function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Donatable({
            title: req.body.title,
            desc: req.body.desc,
            earnedMoney: 0,
            demandedMoney: req.body.demandedMoney,
            preparedPrices: req.body.preparedPrices,
            photo: req.body.photo,
            deleted: false,
            projectId: req.params.projectId
          }).save());

        case 3:
          res.json({
            msg: 'OK'
          });
          _context5.next = 9;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", next(new HttpError('Nepodařilo se vytvořit darovatelný box', 500)));

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.patchSetDonatableDeleted = function (req, res, next) {
  var donatableId = req.params.donatableId;
  Donatable.findOneAndUpdate({
    _id: donatableId
  }, {
    deleted: true
  }).then(function (news) {
    res.json({
      msg: 'ok'
    });
  })["catch"](function (err) {
    return next(new HttpError('Nepodařilo se odstranit sbírku', 500));
  });
};

exports.patchEditDonatable = function _callee6(req, res, next) {
  var updatedDonatable;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Donatable.findByIdAndUpdate(req.params.donatableId, {
            title: req.body.title,
            desc: req.body.desc,
            demandedMoney: req.body.demandedMoney,
            preparedPrices: req.body.preparedPrices,
            photo: req.body.photo
          }));

        case 3:
          updatedDonatable = _context6.sent;
          res.json({
            msg: "OK",
            donatable: updatedDonatable
          });
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", next(new HttpError("Nepodařilo se aktualizovat sbírku", 500)));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};