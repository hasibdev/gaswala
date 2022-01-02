const usersController = require('../../controllers/users.controller')
const auth = require('../../middlewares/auth')
const express = require("express")

const router = express.Router({ mergeParams: true })


/**
 * @Route    /users
 */

router.post('/login', usersController.validate('create'), usersController.login)
router.post('/register', usersController.validate('create'), usersController.create)

router.get('/verify/:token', usersController.verify)
router.post('/forget-password', usersController.forgetPassword)
router.get('/me', auth('users'), usersController.readMe)

router.get('/', auth('admins'), usersController.readAll)
router.post('/', usersController.validate('create'), usersController.create)


router.get('/:id', auth('admins'), usersController.readOne)
router.put('/:id', auth('admins'), usersController.validate('update'), usersController.update)
router.delete('/:id', auth('admins'), usersController.destroy)


// Export to outside
module.exports = router