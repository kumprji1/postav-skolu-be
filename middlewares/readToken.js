const jwt = require('jsonwebtoken');

const HttpError = require('../models/HttpError');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'harry_potter_secret_chamber');
    req.user = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        name: decodedToken.name,
        surname: decodedToken.surname,
        role: decodedToken.role,
      };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
