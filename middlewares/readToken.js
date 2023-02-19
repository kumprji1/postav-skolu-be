const jwt = require('jsonwebtoken');

const HttpError = require('../models/HttpError');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Nemáte oprávnění!');
    }
    const decodedToken = jwt.verify(token, 'postav_skolu_2023_secret');
    req.user = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        name: decodedToken.name,
        surname: decodedToken.surname,
        role: decodedToken.role,
      };
    next();
  } catch (err) {
    const error = new HttpError('Nemáte oprávnění!', 403);
    return next(error);
  }
};
