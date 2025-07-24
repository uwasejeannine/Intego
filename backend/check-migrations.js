const { Client } = require('pg');
const config = require('./config/config');

const checkMigrations = async () => {
  const client = new Client({
    user: config.production.username,
    host: config.production.host,
    database: config.production.database,
    password: config.production.password,
    port: config.production.port,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    const res = await client.query('SELECT name FROM "SequelizeMeta"');
    console.log('Applied migrations:');
    res.rows.forEach(row => {
      console.log(row.name);
    });

    await client.end();
    console.log('Disconnected from the database');
  } catch (err) {
    console.error('Error during database check:', err);
    await client.end();
  }
};

checkMigrations(); 