const { check } = require("express-validator");

exports.postLogin = [
  check("username").notEmpty().withMessage("Zadejte uživatelské jméno"),
  check('password').notEmpty().withMessage("Zadejte heslo")
];

exports.postRegisterUser = [
  check("email").notEmpty().withMessage("Zadejte email"),
  check("name").notEmpty().withMessage("Zadejte jméno"),
  check("surname").notEmpty().withMessage("Zadejte příjmení"),
  check('password').notEmpty().withMessage("Zadejte heslo"),
  check('rePassword').notEmpty().withMessage("Zadejte heslo pro kontrolu")
]