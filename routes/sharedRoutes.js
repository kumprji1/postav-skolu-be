const express = require('express')

const sharedCtrl = require('../controllers/sharedCtrl')

const router = express.Router();

// Projects
router.get('/projects/:projectId', sharedCtrl.getProject)
router.get('/projects-by-url-title/:urlTitle', sharedCtrl.getProjectByTitle)
router.get('/projects', sharedCtrl.getProjects)

// News
router.get('/news/:projectId', sharedCtrl.getNewsByProjectId)
router.get('/news-item/:newsId', sharedCtrl.getNewsItem)

// Donatables
router.get('/donatables-by-project-id/:projectId', sharedCtrl.getDonatablesByProjectId)
router.get('/donatables/:donatableId', sharedCtrl.getDonatableById)

// Donations 
router.get('/donations/:donatableId', sharedCtrl.getDonationsByDonatableId)

// Orders
router.post('/create-order', sharedCtrl.postCreateOrder)
router.get('/order/:orderId', sharedCtrl.getOrderByIdAndUUID)



/**
 * Experimental ↓↓↓
 */

router.get('/few-land-pieces-o3', sharedCtrl.getFewLandPiecesO3)
router.post('/buy-pieces', sharedCtrl.postBuyPieces)

module.exports = router;