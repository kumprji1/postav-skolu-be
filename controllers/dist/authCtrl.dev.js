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
          console.log("Přihlášení");
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", next(new HttpError(errors.errors[0].msg, 422)));

        case 4:
          // Finding user
          user = null;
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }).lean());

        case 8:
          user = _context.sent;
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](5);
          return _context.abrupt("return", next(new HttpError("Nepodařilo se vyhledat v databázi", 500)));

        case 14:
          if (user) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", next(new HttpError("Uživatel " + req.body.email + " neexistuje", 400)));

        case 16:
          if (!user) {
            _context.next = 19;
            break;
          }

          if (user.isLocallyCreated) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", next(new HttpError("Uživatel není registrovaný lokálně. Přihlaste se přes služby třetích stran (Google) nebo zaregistrujte tento email tlačítekm registrovat níže.", 400)));

        case 19:
          // Comparing passwords
          isPasswordCorrect = false;
          _context.prev = 20;
          _context.next = 23;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 23:
          isPasswordCorrect = _context.sent;
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t1 = _context["catch"](20);
          return _context.abrupt("return", next(new HttpError("Cannot compare password", 500)));

        case 29:
          if (isPasswordCorrect) {
            _context.next = 31;
            break;
          }

          return _context.abrupt("return", next(new HttpError("Nesprávné heslo", 401)));

        case 31:
          // Generating token
          user.token = jwt.sign({
            userId: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
          }, "postav_skolu_2023_secret"); // Removing password before sending to client

          user.password = null;
          res.json(user);

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 11], [20, 26]]);
};

exports.postLoginUser_Google = function _callee2(req, res, next) {
  var user, newGoogleUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.body); // Finding Google user

          user = null;
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }).lean());

        case 5:
          user = _context2.sent;
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](2);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se vyhledat v databázi", 500)));

        case 11:
          if (user) {
            _context2.next = 24;
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

          _context2.prev = 13;
          _context2.next = 16;
          return regeneratorRuntime.awrap(newGoogleUser.save());

        case 16:
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t1 = _context2["catch"](13);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se zaregistrovat Google účet", 500)));

        case 21:
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
          }, "postav_skolu_2023_secret");
          return _context2.abrupt("return", res.json(user));

        case 24:
          if (user.isGoogleAssociated) {
            _context2.next = 33;
            break;
          }

          _context2.prev = 25;
          _context2.next = 28;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: user.email
          }, {
            isGoogleAssociated: true
          }));

        case 28:
          _context2.next = 33;
          break;

        case 30:
          _context2.prev = 30;
          _context2.t2 = _context2["catch"](25);
          return _context2.abrupt("return", next(new HttpError("Nepodařilo se asociovat google účet", 500)));

        case 33:
          // Generating token
          user.token = jwt.sign({
            userId: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
          }, "postav_skolu_2023_secret"); // Removing password before sending to client

          user.password = null;
          res.json(user);

        case 36:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 8], [13, 18], [25, 30]]);
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
          console.log(userExists); // Username has to be unique

          if (!userExists) {
            _context4.next = 17;
            break;
          }

          if (!userExists.isLocallyCreated) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", next(new HttpError("Uživatel " + req.body.email + " již existuje", 401)));

        case 17:
          if (!(req.body.password !== req.body.rePassword)) {
            _context4.next = 19;
            break;
          }

          return _context4.abrupt("return", next(new HttpError("Hesla se neshodují", 401)));

        case 19:
          hashedPassword = ""; // Hashing password

          _context4.prev = 20;
          _context4.next = 23;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 12));

        case 23:
          hashedPassword = _context4.sent;
          _context4.next = 29;
          break;

        case 26:
          _context4.prev = 26;
          _context4.t1 = _context4["catch"](20);
          return _context4.abrupt("return", next(new HttpError("Password hasn't been hashed", 500)));

        case 29:
          if (!userExists) {
            _context4.next = 41;
            break;
          }

          if (!userExists.isGoogleAssociated) {
            _context4.next = 41;
            break;
          }

          console.log('Uživatel před google tu je, pojdmě jen aktualizovat data'); // Saving to the database

          _context4.prev = 32;
          _context4.next = 35;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: req.body.email
          }, {
            name: req.body.name,
            surname: req.body.surname,
            password: hashedPassword,
            isLocallyCreated: true
          }));

        case 35:
          _context4.next = 40;
          break;

        case 37:
          _context4.prev = 37;
          _context4.t2 = _context4["catch"](32);
          return _context4.abrupt("return", next(new HttpError("Nepodařilo se uložit uživatele", 500)));

        case 40:
          return _context4.abrupt("return", res.json({
            msg: "Nový uživatel mezi námi!"
          }));

        case 41:
          newUser = new User({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: hashedPassword,
            role: Roles.USER,
            isLocallyCreated: true,
            isGoogleAssociated: false
          }); // Saving to the database

          _context4.prev = 42;
          _context4.next = 45;
          return regeneratorRuntime.awrap(newUser.save());

        case 45:
          _context4.next = 50;
          break;

        case 47:
          _context4.prev = 47;
          _context4.t3 = _context4["catch"](42);
          return _context4.abrupt("return", next(new HttpError("Nepodařilo se uložit uživatele", 500)));

        case 50:
          res.json({
            msg: "Nový uživatel mezi námi!"
          });

        case 51:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 10], [20, 26], [32, 37], [42, 47]]);
};