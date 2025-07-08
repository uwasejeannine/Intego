const dotenv = require("dotenv");

// Configure dotenv to load environment variables
dotenv.config();

module.exports = {
  development: {
    username: "intego_db_71w3_user",
    password: "ksJ07vBdwNiKJS94A26IiRJdnO7dS2Nz",
    database: "intego_db_71w3",
    host: "dpg-d1jvcu2li9vc738s6rqg-a.oregon-postgres.render.com",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
  production: {
    // use_env_variable: "POSTGRES_URL",
    connectionString: "postgresql://intego_db_71w3_user:ksJ07vBdwNiKJS94A26IiRJdnO7dS2Nz@dpg-d1jvcu2li9vc738s6rqg-a/intego_db_71w3",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },

  // config email
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,

  JWT_SECRET: process.env.JWT_SECRET,
};