const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const { sendMail } = require('../services/mail.service')
const { body, validationResult } = require('express-validator')

const { Admin } = require('../models')

/**
 * Admin Login
 */
const login = async function (req, res) {
   const user = await Admin.findOne({ where: { email: req.body.email } })

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

module.exports = {
   login
}