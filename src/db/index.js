const { Pool } = require("pg");
require("dotenv").config();

const pool = process.env.DATABASE_URL
    ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false,
          },
      })
    : new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
      });

pool.connect()
    .then((client) => {
        console.log("✅ PostgreSQL Connected");
        client.release();
    })
    .catch((err) => {
        console.error("❌ PostgreSQL Error:", err);
    });
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

module.exports = pool;
