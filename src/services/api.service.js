const readAll = async function (query, Model) {
   const page = Number.parseInt(query._page)
   const size = Number.parseInt(query._size)
   const defaultPage = 0
   const defaultSize = 20

   const minPage = 0
   const minSize = 0
   const maxSize = 200

   const limit = (size && size > minSize && size <= maxSize) ? size : defaultSize
   const offset = (page && (page - 1) > minPage) ? Number.parseInt(page * size) : defaultPage

   try {
      const users = await Model.findAndCountAll({ limit, offset })

      const pageInfo = {
         count: users.count,
         totalPage: Math.round(users.count / limit),
         current: page || 1,
         nextPage: (page || 1) + 1,
         previous: page > 1 ? page : null
      }
      return Promise.resolve({ pageInfo, data: users.rows })
   } catch (error) {
      return Promise.reject(error)
   }

}


module.exports = {
   readAll
}