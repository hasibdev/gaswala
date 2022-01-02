const controller = require('./controller')
const express = require('express')

const router = express.Router({ mergeParams: true })


router.get('/', controller.readAll)
router.get('/:id', controller.readOne)

router.post('/', controller.validate('create'), controller.create)
router.put('/:id', controller.validate('update'), controller.update)

router.delete('/:id', controller.destroy)


module.exports = router