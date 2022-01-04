const express = require('express')

const router = express.Router()

router.use('/admins', require('./admins.route'))
router.use('/users', require('./users.route'))
router.use('/products', require('./products.route'))
router.use('/sales', require('./sales.route'))


module.exports = router