"use strict";

var _require = require("express-validator"),
    check = _require.check;

exports.createOrEditProject = [check("title").notEmpty().withMessage("Zadejte název projektu"), check("desc").notEmpty().withMessage("Zadejte popis projektu"), check("urlTitle").notEmpty().withMessage("Zadejte URL název projektu"), check("photo").notEmpty().withMessage("Zadejte URL obrázku")];
exports.addOrEditProduct = [check("title").notEmpty().withMessage("Zadejte název produktu"), check("desc").notEmpty().withMessage("Zadejte popis"), check("photo").notEmpty().withMessage("Zadejte URL fotky"), check("price").notEmpty().withMessage("Zadejte cenu produktu").isNumeric().withMessage("Cena musí být číslo"), check("quantity").notEmpty().withMessage("Zadejte dostupné množství produktu").isNumeric().withMessage("Množství musí být číslo")];
exports.postAddOrEditNews = [check("title").notEmpty().withMessage("Zadejte název"), check("text").notEmpty().withMessage("Zadejte text")];
exports.postAddOrEditQuestion = [check("text").notEmpty().withMessage("Zadejte text otázky")];
exports.postAddAnswer = [check("text").notEmpty().withMessage("Napiště text odpovědi")];