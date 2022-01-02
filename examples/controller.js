const { body, validationResult } = require('express-validator')
const { Model } = require('../models')

/**
 * Get All Resources
 */
const readAll = async function (req, res) {
   try {
      const data = await Model.findAll()
      return res.json({ data })
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
      const data = await Model.findByPk(id)
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

   const { } = req.body

   try {
      const data = await Model.create({})
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
   const { } = req.body

   try {
      await Model.update(
         {},
         { where: { id } }
      )

      const data = await Model.findByPk(id)
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
      await Model.destroy({ where: { id } })
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
         return []
         break

      case 'update':
         return []
         break

      default:
         return []
         break
   }
}

module.exports = {
   readAll, readOne, create, update, destroy, validate
}