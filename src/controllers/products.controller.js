const { Product } = require('../models')
const { body, validationResult } = require('express-validator')
const apiService = require('../services/api.service')

/**
 * Get All Resources
 */
const readAll = async function (req, res) {
   try {
      const data = await apiService.paginated(req.query, Product)
      return res.json(data)
   } catch (error) {
      return res.status(500).json({ message: 'Something went wrong!', error })
   }
}
/**
 * Get Single Resources 
 */
const readOne = async function (req, res) {
   const { id } = req.params

   try {
      const data = await Product.findByPk(id)
      if (!data) return res.status(404).json({ message: `No data found for the id: ${id}` })

      return res.json({ data })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Create Resources
 */
const create = async function (req, res) {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
   }

   const { name, price, unit } = req.body

   try {
      const data = await Product.create({ name, price, unit })
      return res.json({ data })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Update Resources
 */
const update = async function (req, res) {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
   }

   const { id } = req.params
   const { name, price, unit } = req.body

   try {
      await Product.update(
         { name, price, unit },
         { where: { id } }
      )

      const data = await Product.findByPk(id)
      return res.json({ data })

   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Delete Resources
 */
const destroy = async function (req, res) {
   const { id } = req.params

   try {
      await Product.destroy({ where: { id } })
      return res.json({ message: 'Deleted Successfully', id })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Request Validation
 */
const validate = function (method) {
   switch (method) {
      case 'create':
         return [
            body('name').notEmpty(),
            body('price').notEmpty(),
            body('unit').notEmpty(),
         ]
         break

      case 'update':
         return [
            body('name').notEmpty(),
            body('price').notEmpty(),
            body('unit').notEmpty(),
         ]
         break

      default:
         return []
         break
   }
}

module.exports = {
   readAll, readOne, create, update, destroy, validate
}