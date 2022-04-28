const { DB_HOST, DB_DATABASE, DB_USER, DB_PWD, DB_PORT } = process.env

module.exports = {
  db : {
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PWD,
    port: DB_PORT,
  }
}
