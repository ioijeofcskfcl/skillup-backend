const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;
