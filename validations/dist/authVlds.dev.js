"use strict";

var _require = require("express-validator"),
    check = _require.check;

exports.postLogin = [check("email").notEmpty().isEmail().withMessage("Zadejte email"), check('password').notEmpty().withMessage("Zadejte heslo")];
exports.postRegisterUser = [check("email").notEmpty().isEmail().withMessage("Zadejte email"), check("name").notEmpty().withMessage("Zadejte jméno"), check("surname").notEmpty().withMessage("Zadejte příjmení"), check('password').notEmpty().withMessage("Zadejte heslo"), check('rePassword').notEmpty().withMessage("Zadejte heslo pro kontrolu")];
exports.postLoginUserGoogle = [check("email").notEmpty().withMessage("Zadejte email"), check("name").notEmpty().withMessage("Zadejte jméno"), check("surname").notEmpty().withMessage("Zadejte příjmení")];