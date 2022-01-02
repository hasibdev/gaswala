const adminController = require('../../controllers/admins.controller')
const express = require("express")

const router = express.Router({ mergeParams: true })

/**
 * @Route    /admins
 */
router.post('/login', adminController.login)

// Export to outside
module.exports = router