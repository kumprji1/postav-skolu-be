const HttpError = require('../models/HttpError')
const Order = require('../models/Order')

exports.getOrdersByUserEmail = async (req, res, next) => {
    let orders = []
    try {
        orders = await Order.find({'contact.email': req.user.email})
        res.json(orders)
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst objednávky uživatele', 500))
    }
}

exports.getDonationsOfOrder = async (req, res, next) => {
    // let donations = []
    // try {
    //     donations = await 
    // } catch (err) {
    //     return next(new HttpError('Nepodařilo se načíst dary objednávky', 500))
    // }
}