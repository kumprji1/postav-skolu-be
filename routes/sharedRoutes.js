const express = require('express')

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

router.get('/get-projects-by-category/:category', sharedCtrl.getProjectByCategory)

/**
 * Experimental ↓↓↓
 */

router.get('/few-land-pieces-o3', sharedCtrl.getFewLandPiecesO3)
router.post('/buy-pieces', sharedCtrl.postBuyPieces)

module.exports = router;