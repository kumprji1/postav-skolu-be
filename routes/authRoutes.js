const express = require("express");

const authCtrl = require("../controllers/authCtrl");
const authVldt = require("../validations/authVlds");

const router = express.Router();

router.post("/login", authVldt.postLogin, authCtrl.postLogin);
router.post(
  "/register-user",
  authVldt.postRegisterUser,
  authCtrl.postRegisterUser
);

module.exports = router;
