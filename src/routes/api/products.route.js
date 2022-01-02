const productsController = require('../../controllers/products.controller')
const express = require('express')

const router = express.Router({ mergeParams: true })


router.get('/', productsController.readAll)
router.get('/:id', productsController.readOne)

router.post('/', productsController.validate('create'), productsController.create)
router.put('/:id', productsController.validate('update'), productsController.update)

router.delete('/:id', productsController.destroy)


module.exports = router