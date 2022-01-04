const { Sale, User } = require('../models')
const { body, validationResult } = require('express-validator')
const apiService = require('../services/api.service')

/**
 * Get All Resources
 */
const readAll = async function (req, res) {
   try {
      const data = await apiService.paginated(req.query, Sale, { include: [User] })
      return res.json(data)
   } catch (error) {
      return res.status(500).json({ error })
   }
}
/**
 * Get Single Resources 
 */
const readOne = async function (req, res) {
   const { id } = req.params

   try {
      const data = await Sale.findOne({
         where: { id },
         include: [{ model: User }]
      })
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

   const { payment, userId, productId } = req.body

   try {
      const data = await Sale.create({ payment, userId, productId })
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
   const { payment, userId, productId } = req.body

   try {
      await Sale.update(
         { payment, userId, productId },
         { where: { id } }
      )

      const data = await Sale.findByPk(id)
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
      await Sale.destroy({ where: { id } })
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
            body('payment').notEmpty(),
            body('userId').notEmpty(),
            body('productId').notEmpty(),
         ]
         break

      case 'update':
         return [
            body('payment').notEmpty(),
            body('userId').notEmpty(),
            body('productId').notEmpty(),
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