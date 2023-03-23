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

router.post('/create-news/:urlTitle', adminCtrl.postCreateNews);
router.patch('/news/delete/:newsId', adminCtrl.patchSetNewsDeleted);
router.patch('/edit-news/:newsId', adminCtrl.patchEditNews); // Donatables

router.post('/create-donatable/:projectId', adminCtrl.postCreateDonatable);
router.patch('/donatable/delete/:donatableId', adminCtrl.patchSetDonatableDeleted);
router.patch('/edit-donatable/:donatableId', adminCtrl.patchEditDonatable); // Donations 
// Orders

/**
 * Experimental ↓↓↓
 */

module.exports = router;