const express = require('express')

const adminCtrl = require('../controllers/adminCtrl');
const adminVlds = require('../validations/adminVlds')

// Auth
const isAdmin = require('../middlewares/isAdmin');
const readToken = require('../middlewares/readToken');

const router = express.Router();

// Check auth
router.use(readToken, isAdmin)

// Projects
router.post('/create-project', adminVlds.createOrEditProject, adminCtrl.postCreateProject)
router.patch('/edit-project/:projectId', adminVlds.createOrEditProject, adminCtrl.patchEditProject)
router.patch('/project/delete/:projectId', adminCtrl.patchSetProjectDeleted)

// News
router.post('/create-news/:urlTitle', adminVlds.postAddOrEditNews, adminCtrl.postCreateNews)
router.patch('/edit-news/:newsId', adminVlds.postAddOrEditNews, adminCtrl.patchEditNews)
router.patch('/news/delete/:newsId', adminCtrl.patchSetNewsDeleted)

// Donatables
router.post('/create-donatable/:projectId', adminVlds.createOrEditDonatable, adminCtrl.postCreateDonatable)
router.patch('/edit-donatable/:donatableId', adminVlds.createOrEditDonatable, adminCtrl.patchEditDonatable)
router.patch('/donatable/delete/:donatableId', adminCtrl.patchSetDonatableDeleted)

// Donations 

// Orders


/**
 * Experimental ↓↓↓
 */


module.exports = router;