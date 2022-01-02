module.exports = {
   development: {
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'database_development',
      host: process.env.DATABASE_HOST || 'localhost',
      dialect: 'mysql',
      logging: false
   },
   production: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      dialect: 'mysql',
      logging: false
   }
}
