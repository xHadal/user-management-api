const { Pool } = require("pg");

async function dbInit() {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: process.env.USER_NAME,
      host: process.env.HOST_NAME,
      dialect: process.env.DIALECT,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    global.pool = pool;
    pool.connect((err, client, release) => {
      if (err) {
        return console.error("Error in connection:", err);
      }
      client.query("SELECT NOW()", (err, result) => {
        release();
        if (err) {
          return console.error("Error executing query:", err);
        }
        console.info("DB: Connected to", process.env.DB_NAME);
        resolve(pool);
      });
    });
  });
}

module.exports = dbInit;
