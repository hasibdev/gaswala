const { Admin } = require('../models')
const readline = require('readline')
const bcrypt = require("bcrypt")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const validateEmail = (email) => {
   return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   )
}

rl.question('First Name: ', firstName => {
   rl.question('Last Name: ', lastName => {
      rl.question('Email: ', email => {
         rl.question('Password: ', password => {
            rl.question('Confirm Password: ', async confirmedPassword => {
               if (password.length < 5) {
                  console.log("Password must have to be 6 character long!")
                  console.log('Operation Fail!')
                  return rl.close()
               }

               if (password !== confirmedPassword) {
                  console.log("Password Doesn't match")
                  console.log('Operation Fail!')
                  return rl.close()
               }

               if (!validateEmail(email)) {
                  console.log("Please enter a valid Email Address!")
                  console.log('Operation Fail!')
                  return rl.close()
               }

               try {
                  const user = await Admin.findOne({ where: { email } })

                  if (user) {
                     console.log('E-mail already exits!')
                     console.log('Operation Fail!')
                     return rl.close()
                  }

                  const hashPassword = await bcrypt.hash(password, 10)

                  await Admin.create({ firstName, lastName, email, password: hashPassword })
                  console.log("Admin Created Successfully!")
               } catch (error) {
                  console.error(error)
               } finally {
                  rl.close()
               }
            })
         })
      })
   })
})
