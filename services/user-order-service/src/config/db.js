const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected");

    await createTables();
  } catch (error) {
    console.error(
      "PostgreSQL connection failed:",
      error.message
    );

    process.exit(1);
  }
};

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,

      user_id INTEGER NOT NULL
        REFERENCES users(id),

      restaurant_id VARCHAR(100) NOT NULL,

      items JSONB NOT NULL,

      total_amount NUMERIC(10, 2) NOT NULL,

      delivery_address TEXT NOT NULL,

      status VARCHAR(30)
        DEFAULT 'PLACED',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("PostgreSQL tables ready");
};

module.exports = {
  pool,
  connectDB
};