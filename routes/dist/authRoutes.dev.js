"use strict";

var express = require("express");

var authCtrl = require("../controllers/authCtrl");

var authVldt = require("../validations/authVlds");

var router = express.Router();
router.post("/login", authVldt.postLogin, authCtrl.postLogin);
router.post("/register-user", authVldt.postRegisterUser, authCtrl.postRegisterUser);
router.post("/register-admin", authVldt.postRegisterUser, authCtrl.postRegisterAdmin);
router.post("/login-google", authVldt.postLoginUserGoogle, authCtrl.postLoginUser_Google);
module.exports = router;