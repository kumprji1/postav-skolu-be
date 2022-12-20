const { check } = require("express-validator");

exports.postRegisterPupil = [
  check("username").notEmpty().withMessage("Zadejte uživatelské jméno"),
  check("name").notEmpty().withMessage("Zadejte jméno"),
  check("surname").notEmpty().withMessage("Zadejte příjmení"),
  check("password").notEmpty().withMessage("Zadejte heslo"),
  check("rePassword").notEmpty().withMessage("Zadejte heslo pro kontrolu"),
];

exports.addOrEditProduct = [
  check("title").notEmpty().withMessage("Zadejte název produktu"),
  check("desc").notEmpty().withMessage("Zadejte popis"),
  check("photo").notEmpty().withMessage("Zadejte URL fotky"),
  check("price")
    .notEmpty()
    .withMessage("Zadejte cenu produktu")
    .isNumeric()
    .withMessage("Cena musí být číslo"),
  check("quantity")
    .notEmpty()
    .withMessage("Zadejte dostupné množství produktu")
    .isNumeric()
    .withMessage("Množství musí být číslo"),
];

exports.postAddOrEditEvent = [
  check("title").notEmpty().withMessage("Zadejte název"),
  check("description").notEmpty().withMessage("Zadejte popis"),
];

exports.postAddOrEditQuestion = [
  check("text").notEmpty().withMessage("Zadejte text otázky"),
];

exports.postAddAnswer = [
  check("text").notEmpty().withMessage("Napiště text odpovědi"),
];
