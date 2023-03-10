const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Models
const User = require("../models/User");
const HttpError = require("../models/HttpError");

// Utils
const { Roles, AuthServices } = require("../utils/roles");

exports.postLogin = async (req, res, next) => {
  console.log("Přihlášení");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.errors[0].msg, 422));
  }

  // Finding user
  let user = null;
  try {
    user = await User.findOne({ email: req.body.email }).lean();
  } catch (err) {
    return next(new HttpError("Nepodařilo se vyhledat v databázi", 500));
  }

  // Stops loggining process if no user found
  if (!user)
    return next(
      new HttpError("Uživatel " + req.body.email + " neexistuje", 400)
    );

  // Comparing passwords
  let isPasswordCorrect = false;
  try {
    isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
  } catch (err) {
    return next(new HttpError("Cannot compare password", 500));
  }

  // Stops loggining procces if password is incorrect
  if (!isPasswordCorrect) return next(new HttpError("Nesprávné heslo", 401));

  // Generating token
  user.token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.role,
    },
    "postav_skolu_2023_secret"
  );

  // Removing password before sending to client
  user.password = null;

  res.json(user);
};

exports.postLoginUser_Google = async (req, res, next) => {
  console.log(req.body);

  // Finding Google user
  let user = null;
  try {
    user = await User.findOne({
      email: req.body.email,
      belong: AuthServices.GOOGLE,
    }).lean();
  } catch (err) {
    return next(new HttpError("Nepodařilo se vyhledat v databázi", 500));
  }

  // Register new google user if no user found
  if (!user) {
    const newGoogleUser = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: "none",
      role: Roles.USER,
      belong: AuthServices.GOOGLE,
    });

    // Saving to the database
    try {
      await newGoogleUser.save();
    } catch (err) {
      return next(
        new HttpError("Nepodařilo se zaregistrovat Google účet", 500)
      );
    }

    user = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      role: Roles.USER,
      belong: AuthServices.GOOGLE
    }
    user.token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
      },
      "postav_skolu_2023_secret"
    );

    return res.json(user);
  }

  // Generating token
  user.token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.role,
    },
    "postav_skolu_2023_secret"
  );

  // Removing password before sending to client
  user.password = null;

  res.json(user);
};

exports.postRegisterAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.errors[0].msg, 422));
  }

  // Finding existing admin
  let existAdmin = false;
  try {
    existAdmin = await User.exists({ role: Role.ADMIN });
  } catch (err) {
    return next(new HttpError("Cannot find if admin already exists", 500));
  }

  // Only 1 admin is alowed
  if (existAdmin)
    return next(
      new HttpError("Jeden admin vládne všem. Více adminů není povoleno", 401)
    );

  // Comparing passwords
  if (req.body.password !== req.body.rePassword)
    return next(new HttpError("Hesla se neshodují", 401));

  let hashedPassword = "";

  // Hashing password
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    return next(new HttpError("Password hasn't been hashed", 500));
  }

  const newAdmin = new User({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: hashedPassword,
    role: Roles.ADMIN,
    belong: AuthServices.LOCAL,
  });

  // Saving to the database
  try {
    await newAdmin.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit učitele", 500));
  }

  res.json({ msg: "Admin created!" });
};

exports.postRegisterUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError(errors.errors[0].msg, 500));

  // Finding existing user with given username
  let userExists = false;
  try {
    userExists = await User.exists({ email: req.body.email });
  } catch (err) {
    return next(new HttpError("Cannot retrieve data from database", 500));
  }

  // Username has to be unique
  if (userExists)
    return next(
      new HttpError("Uživatel " + req.body.email + " již existuje", 401)
    );

  // Comparing passwords
  if (req.body.password !== req.body.rePassword)
    return next(new HttpError("Hesla se neshodují", 401));

  let hashedPassword = "";

  // Hashing password
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    return next(new HttpError("Password hasn't been hashed", 500));
  }

  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    password: hashedPassword,
    role: Roles.USER,
    belong: AuthServices.LOCAL,
  });

  // Saving to the database
  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit žáka", 500));
  }

  res.json({ msg: "Nový čaroděj mezi námi!" });
};
