const SaleController = require('../../controllers/sales.controller')
const express = require('express')

const router = express.Router({ mergeParams: true })


router.get('/', SaleController.readAll)
router.get('/:id', SaleController.readOne)

router.post('/', SaleController.validate('create'), SaleController.create)
router.put('/:id', SaleController.validate('update'), SaleController.update)

router.delete('/:id', SaleController.destroy)


module.exports = router