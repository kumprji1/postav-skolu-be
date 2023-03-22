"use strict";

var express = require('express');

var sharedCtrl = require('../controllers/sharedCtrl');

var router = express.Router(); // Projects

router.get('/projects/:projectId', sharedCtrl.getProject);
router.get('/projects-by-title/:urlTitle', sharedCtrl.getProjectByTitle);
router.get('/projects', sharedCtrl.getProjects); // News

router.get('/news/:projectId', sharedCtrl.getNewsByProjectId); // Donatables

router.get('/donatables/:projectId', sharedCtrl.getDonatablesByProjectId); // Donations 

router.get('/donations/:donatableId', sharedCtrl.getDonationsByDonatableId); // Orders

router.post('/create-order', sharedCtrl.postCreateOrder);
router.get('/order/:orderId', sharedCtrl.getOrderByIdAndUUID);
/**
 * Experimental ↓↓↓
 */

router.get('/few-land-pieces-o3', sharedCtrl.getFewLandPiecesO3);
router.post('/buy-pieces', sharedCtrl.postBuyPieces);
module.exports = router;