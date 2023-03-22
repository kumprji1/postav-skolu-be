"use strict";

var express = require('express');

var adminCtrl = require('../controllers/adminCtrl');

var adminVlds = require('../validations/adminVlds'); // Auth


var isAdmin = require('../middlewares/isAdmin');

var readToken = require('../middlewares/readToken');

var router = express.Router(); // Check auth

router.use(readToken, isAdmin); // Projects

router.post('/create-project', adminVlds.createOrEditProject, adminCtrl.postCreateProject);
router.patch('/edit-project/:projectId', adminVlds.createOrEditProject, adminCtrl.patchEditProject); // News

router.post('/create-news/:urlTitle', adminCtrl.postCreateNews); // Donatables

router.post('/create-donatable/:projectId', adminCtrl.postCreateDonatable); // Donations 
// Orders

/**
 * Experimental ↓↓↓
 */

module.exports = router;