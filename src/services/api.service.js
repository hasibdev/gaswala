const { Sale } = require('../models')

const paginated = async function (query, Model) {
   const defaultPage = 0
   const defaultSize = 20

   const minPage = 0
   const minSize = 0
   const maxSize = 200

   const page = Number.parseInt(query._page) || defaultPage
   const size = Number.parseInt(query._size) || defaultSize

   const limit = (size > minSize && size <= maxSize) ? size : defaultSize
   const offset = ((page - 1) > minPage) ? Number.parseInt((page - 1) * size) : defaultPage

   try {
      const data = await Model.findAndCountAll({ limit, offset })

      const meta = {
         count: data.count,
         limit: size,
         totalPage: Math.ceil(data.count / limit),
         previous: page > 1 ? (page - 1) : null,
         current: page || 1,
         nextPage: (page || 1) + 1,
      }
      return Promise.resolve({ meta, data: data.rows })
   } catch (error) {
      return Promise.reject(error)
   }

}


module.exports = {
   paginated
}