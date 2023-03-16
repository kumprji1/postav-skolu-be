const express = require('express')

const userCtrl = require('../controllers/userCtrl');
const readToken = require('../middlewares/readToken');

const router = express.Router();

// is Autenticated (User and Admin both allowed)
router.use(readToken)

// Orders
router.get('/orders-by-user-email', userCtrl.getOrdersByUserEmail)

module.exports = router;