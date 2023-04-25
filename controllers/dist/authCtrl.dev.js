"use strict";

var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

var _require = require("express-validator"),
    validationResult = _require.validationResult; // Models


var User = require("../models/User");

var HttpError = require("../models/HttpError"); // Utils


var _require2 = require("../utils/roles"),
    Roles = _require2.Roles,
    AuthServices = _require2.AuthServices;

exports.postLogin = function _callee(req, res, next) {
  var errors, user, isPasswordCorrect;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next(new HttpError(errors.errors[0].msg, 422)));

        case 3:
          // Finding user
          user = null;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }).lean());

        case 7:
          user = _context.sent;
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](4);
          return _context.abrupt("return", next(new HttpError("Nepodařilo se vyhledat v databázi", 500)));

        case 13:
          if (user) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", next(new HttpError("Uživatel " + req.body.email + " neexistuje", 400)));

        case 15:
          if (!user) {
            _context.next = 18;
            break;
          }

          if (user.isLocallyCreated) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", next(new HttpError("Uživatel není registrovaný lokálně. Přihlaste se přes služby třetích stran (Google) nebo zaregistrujte tento email tlačítekm registrovat níže.", 400)));

        case 18:
          // Comparing passwords
          isPasswordCorrect = false;
          _context.prev = 19;
          _context.next = 22;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 22:
          isPasswordCorrect = _context.sent;
          _context.next = 28;
          break;

        case 25:
          _context.prev = 25;
          _context.t1 = _context["catch"](19);
          return _context.abrupt("return", next(new HttpError("Cannot compare password", 500)));

        case 28:
          if (isPasswordCorrect) {
            _context.next = 30;
            break;
          }

          return _context.abrupt("return", next(new HttpError("Nesprávné heslo", 401)));

        case 30:
          // Generating token
          user.token = jwt.sign({
            userId: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          }); // Removing password before sending to client

          user.password = null;
          res.json(user);

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 10], [19, 25]]);
};

exports.postLoginUser_Google = function _callee2(req, res, next) {
  var user, newGoogleUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Finding Google user
          user = null;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }).lean());

        case 4:
          user = _context2.sent;
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se vyhledat v databázi", 500)));

        case 10:
          if (user) {
            _context2.next = 23;
            break;
          }

          newGoogleUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: "none",
            role: Roles.USER,
            isLocallyCreated: false,
            isGoogleAssociated: true
          }); // Saving to the database

          _context2.prev = 12;
          _context2.next = 15;
          return regeneratorRuntime.awrap(newGoogleUser.save());

        case 15:
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t1 = _context2["catch"](12);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se zaregistrovat Google účet", 500)));

        case 20:
          user = {
            name: newGoogleUser.name,
            surname: newGoogleUser.surname,
            email: newGoogleUser.email,
            role: newGoogleUser.role
          };
          user.token = jwt.sign({
            userId: newGoogleUser._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          return _context2.abrupt("return", res.json(user));

        case 23:
          if (user.isGoogleAssociated) {
            _context2.next = 32;
            break;
          }

          _context2.prev = 24;
          _context2.next = 27;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: user.email
          }, {
            isGoogleAssociated: true
          }));

        case 27:
          _context2.next = 32;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t2 = _context2["catch"](24);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se asociovat google účet", 500)));

        case 32:
          // Generating token
          user.token = jwt.sign({
            userId: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          }); // Removing password before sending to client

          user.password = null;
          res.json(user);

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 7], [12, 17], [24, 29]]);
};

exports.postRegisterAdmin = function _callee3(req, res, next) {
  var errors, existAdmin, hashedPassword, newAdmin;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", next(new HttpError(errors.errors[0].msg, 422)));

        case 3:
          // Finding existing admin
          existAdmin = false;
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.exists({
            role: Role.ADMIN
          }));

        case 7:
          existAdmin = _context3.sent;
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](4);
          return _context3.abrupt("return", next(new HttpError("Cannot find if admin already exists", 500)));

        case 13:
          if (!existAdmin) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", next(new HttpError("Jeden admin vládne všem. Více adminů není povoleno", 401)));

        case 15:
          if (!(req.body.password !== req.body.rePassword)) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", next(new HttpError("Hesla se neshodují", 401)));

        case 17:
          hashedPassword = ""; // Hashing password

          _context3.prev = 18;
          _context3.next = 21;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 12));

        case 21:
          hashedPassword = _context3.sent;
          _context3.next = 27;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t1 = _context3["catch"](18);
          return _context3.abrupt("return", next(new HttpError("Password hasn't been hashed", 500)));

        case 27:
          newAdmin = new User({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: hashedPassword,
            role: Roles.ADMIN,
            isLocallyCreated: true,
            isGoogleAssociated: false
          }); // Saving to the database

          _context3.prev = 28;
          _context3.next = 31;
          return regeneratorRuntime.awrap(newAdmin.save());

        case 31:
          _context3.next = 36;
          break;

        case 33:
          _context3.prev = 33;
          _context3.t2 = _context3["catch"](28);
          return _context3.abrupt("return", next(new HttpError("Nepodařilo se uložit admina", 500)));

        case 36:
          res.json({
            msg: "Admin created!"
          });

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 10], [18, 24], [28, 33]]);
};

exports.postRegisterUser = function _callee4(req, res, next) {
  var errors, userExists, hashedPassword, newUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", next(new HttpError(errors.errors[0].msg, 500)));

        case 3:
          // Finding existing user with given email
          userExists = false;
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }).lean());

        case 7:
          userExists = _context4.sent;
          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](4);
          return _context4.abrupt("return", next(new HttpError("Cannot retrieve data from database", 500)));

        case 13:
          if (!userExists) {
            _context4.next = 16;
            break;
          }

          if (!userExists.isLocallyCreated) {
            _context4.next = 16;
            break;
          }

          return _context4.abrupt("return", next(new HttpError("Uživatel " + req.body.email + " již existuje", 401)));

        case 16:
          if (!(req.body.password !== req.body.rePassword)) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", next(new HttpError("Hesla se neshodují", 401)));

        case 18:
          hashedPassword = ""; // Hashing password

          _context4.prev = 19;
          _context4.next = 22;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 12));

        case 22:
          hashedPassword = _context4.sent;
          _context4.next = 28;
          break;

        case 25:
          _context4.prev = 25;
          _context4.t1 = _context4["catch"](19);
          return _context4.abrupt("return", next(new HttpError("Password hasn't been hashed", 500)));

        case 28:
          if (!userExists) {
            _context4.next = 39;
            break;
          }

          if (!userExists.isGoogleAssociated) {
            _context4.next = 39;
            break;
          }

          _context4.prev = 30;
          _context4.next = 33;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: req.body.email
          }, {
            name: req.body.name,
            surname: req.body.surname,
            password: hashedPassword,
            isLocallyCreated: true
          }));

        case 33:
          _context4.next = 38;
          break;

        case 35:
          _context4.prev = 35;
          _context4.t2 = _context4["catch"](30);
          return _context4.abrupt("return", next(new HttpError("Nepodařilo se uložit uživatele", 500)));

        case 38:
          return _context4.abrupt("return", res.json({
            msg: "Nový uživatel mezi námi!"
          }));

        case 39:
          newUser = new User({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: hashedPassword,
            role: Roles.USER,
            isLocallyCreated: true,
            isGoogleAssociated: false
          }); // Saving to the database

          _context4.prev = 40;
          _context4.next = 43;
          return regeneratorRuntime.awrap(newUser.save());

        case 43:
          _context4.next = 48;
          break;

        case 45:
          _context4.prev = 45;
          _context4.t3 = _context4["catch"](40);
          return _context4.abrupt("return", next(new HttpError("Nepodařilo se uložit uživatele", 500)));

        case 48:
          res.json({
            msg: "Nový uživatel mezi námi!"
          });

        case 49:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 10], [19, 25], [30, 35], [40, 45]]);
};