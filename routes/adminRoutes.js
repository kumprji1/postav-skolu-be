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
router.post('/create-news/:urlTitle', adminCtrl.postCreateNews)
router.patch('/news/delete/:newsId', adminCtrl.patchSetNewsDeleted)
router.patch('/edit-news/:newsId', adminCtrl.patchEditNews)

// Donatables
router.post('/create-donatable/:projectId', adminCtrl.postCreateDonatable)
router.patch('/donatable/delete/:donatableId', adminCtrl.patchSetDonatableDeleted)
router.patch('/edit-donatable/:donatableId', adminCtrl.patchEditDonatable)

// Donations 

// Orders


/**
 * Experimental ↓↓↓
 */


module.exports = router;