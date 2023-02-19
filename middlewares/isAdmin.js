// Models
const HttpError = require('../models/HttpError')

// Utils
const { Roles } = require('../utils/roles')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (req.user.role === Roles.ADMIN) return next();
    else return next(new HttpError('Nemáte administrátorská práva', 401));
}