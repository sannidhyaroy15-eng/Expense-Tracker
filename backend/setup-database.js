require('dotenv').config();
const mysql = require('mysql2/promise');

const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✓ Connected to MySQL');

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'expense_tracker'}`);
    console.log(`✓ Database '${process.env.DB_NAME || 'expense_tracker'}' created/verified`);

    await connection.end();
    console.log('✓ Setup complete!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

createDatabase();
