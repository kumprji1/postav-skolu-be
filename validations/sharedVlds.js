exports.postCreateOrder = [
    check("email").notEmpty().isEmail().withMessage("Zadejte email"),
    check('password').notEmpty().withMessage("Zadejte heslo")
  ];