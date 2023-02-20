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

// Donatables
router.post('/create-donatable/:projectId', adminCtrl.postCreateDonatable)

// Donations 

// Orders


/**
 * Experimental ↓↓↓
 */


module.exports = router;