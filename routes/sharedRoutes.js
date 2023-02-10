const express = require('express')

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

// Projects
router.get('/get-projects-by-category/:category', sharedCtrl.getProjectByCategory)
router.get('/project/:urlTitle', sharedCtrl.getProject)

// Donatables
router.get('/donatables/:projectId', sharedCtrl.getDonatablesByProjectId)

// Orders
router.post('/create-order', sharedCtrl.postCreateOrder)


/**
 * Experimental ↓↓↓
 */

router.get('/few-land-pieces-o3', sharedCtrl.getFewLandPiecesO3)
router.post('/buy-pieces', sharedCtrl.postBuyPieces)

module.exports = router;