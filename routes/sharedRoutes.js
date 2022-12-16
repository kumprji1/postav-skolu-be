const express = require('express')

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

router.get('/get-projects-by-category/:category', sharedCtrl.getProjectByCategory)

module.exports = router;