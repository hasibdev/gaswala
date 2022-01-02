const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const { sendMail } = require('../services/mail.service')
const { body, validationResult } = require('express-validator')
const { User } = require('../models')

/**
 * User Login
 */
const login = async function (req, res) {
   const user = await User.findOne({ where: { email: req.body.email } })

   if (!user) return res.status(400).json({ message: 'User Not found!' })

   const checkPassword = await bcrypt.compare(req.body.password, user.password)
   const jwtSecret = process.env.JWT_SECRET

   if (checkPassword) {
      jwt.sign({ user }, jwtSecret, (err, token) => {
         if (err) {
            return res.status(500).json({ message: 'Error in JWT token generation' })
         }
         return res.json({ token, user })
      })
   } else {
      return res.status(401).json({ message: 'Invalid Email or Password' })
   }

}

/**
 * Read All Data
 */
const readAll = async function (req, res) {

   const page = Number.parseInt(req.query._page)
   const size = Number.parseInt(req.query._size)
   const defaultPage = 0
   const defaultSize = 25

   const minPage = 0
   const minSize = 0
   const maxSize = 200

   const limit = (size && size > minSize && size <= maxSize) ? size : defaultSize
   const offset = (page && page > minPage) ? Number.parseInt(page * size) : defaultPage

   try {
      const users = await User.findAndCountAll({ limit, offset })

      const pageInfo = {
         total: Math.round(users.count / size),
         current: page,
         nextPage: page + 1,
         previous: page - 1
      }
      return res.json({ data: users.rows, pageInfo })
   } catch (error) {
      return res.status(500).json({ message: 'Something went wrong!', error })
   }
}

/**
 * Read One Data
 */
const readOne = async function (req, res) {
   const { id } = req.params

   try {
      const data = await User.findByPk(id)
      if (!data) return res.status(404).json({ message: `No data found for the id: ${id}` })

      return res.json({ data })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Read Me
 */
const readMe = async function (req, res) {
   const authHeader = req.headers['authorization']
   if (!authHeader) return res.status(401).json({ message: 'You are not authenticated!' })
   let token = authHeader.includes('Bearer') ? authHeader.split(' ')[1] : authHeader
   const jwtSecret = process.env.JWT_SECRET

   jwt.verify(token, jwtSecret, async (err, value) => {
      if (err) return res.status(401).json({ message: 'Invalid token!' })
      try {
         const user = await User.findByPk(value.user.id)
         return res.json({ user })
      } catch (error) {
         res.status(500).json({ message: 'Something went wrong!' })
      }
   })

}

/**
 * Create New Data
 */
const create = async function (req, res) {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
   }

   const { firstName, lastName, email, password } = req.body
   const hashPassword = await bcrypt.hash(password, 10)

   try {
      const user = await User.create({ firstName, lastName, email, password: hashPassword })
      const jwtSecret = process.env.JWT_SECRET

      jwt.sign({ user }, jwtSecret, async (err, token) => {
         if (err) return res.status(500).json({ message: 'Error in JWT token generation' })

         // Send Verification Mail
         const url = `http://localhost:8000/api/users/verify/${token}`
         sendMail({
            to: email,
            subject: "Email Verification",
            text: "Verify Your Email Address.",
            html: `
               <p>Please <a href="${url}" target="_blank">verify</a> your email address</p>
               <br />
               <a href="${url}" target="_blank">Click Here</a>
            `
         })

         return res.json({ data: user, token })
      })

   } catch (error) {
      return res.status(500).json({ error })
   }
}
/**
 * Update Old Data
 */
const update = async function (req, res) {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
   }

   const { id } = req.params
   const { firstName, lastName, email } = req.body

   try {
      await User.update(
         { firstName, lastName, email },
         { where: { id } }
      )

      const data = await User.findByPk(id)
      return res.json({ data })

   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Delete Data
 */
const destroy = async function (req, res) {
   const { id } = req.params

   try {
      await User.destroy({ where: { id } })
      return res.json({ message: 'Deleted Successfully', id })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

/**
 * Verify Email
 */
const verify = async function (req, res) {
   const { token } = req.params

   const jwtSecret = process.env.JWT_SECRET

   jwt.verify(token, jwtSecret, async (err, { user }) => {
      if (err) return res.status(401).json({ message: 'Invalid token!' })

      try {
         await User.update(
            { verified: true },
            { where: { id: user.id } }
         )
         return res.json({ message: 'Verified success!' })

      } catch (error) {
         return res.status(500).json({ error })
      }

   })

}

/**
 * Forget Password
 */
const forgetPassword = function (req, res) {
   res.json({ message: 'Forget Password' })
}

/**
 * Request Validation
 */
const validate = function (method) {
   switch (method) {
      case 'create':
         return [
            body('firstName').notEmpty().isLength({ max: 50 }),
            body('lastName').notEmpty().isLength({ max: 50 }),
            body('email').notEmpty().isEmail().custom(async (email) => {
               const user = await User.findOne({ where: { email } })
               if (user) {
                  throw new Error('E-mail already in use')
               }
               return true
            }),

            body('password').notEmpty().isLength({ min: 6, max: 30 }),
            body('confirmed_password').custom((value, { req }) => {
               if (value !== req.body.password) {
                  throw new Error('Password confirmation does not match password')
               }
               return true
            })
         ]
         break

      case 'update':
         return [
            body('firstName').notEmpty(),
            body('lastName').notEmpty(),
            body('email').notEmpty().isEmail(),
         ]
         break

      default:
         return []
         break
   }
}



// Export to outside
module.exports = {
   login, readAll, readOne, create, update, destroy, verify, readMe, forgetPassword, validate
}