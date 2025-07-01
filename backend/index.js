const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models/index");
const allRoutes = require("./src/routes/routes");
const path = require("path");

dotenv.config();

const { PORT, DB_NAME } = process.env;

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", allRoutes);
const server = app.listen(PORT || 3000, () => {
  console.log(`Server started on port ${PORT}`);
});

// INITIATE DATABASE CONNECTION
const dbCon = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Database ${DB_NAME} connected successfully`);
  } catch (error) {
    console.log(error);
  }
};

// START SERVER
Promise.all([server, dbCon()]).catch((error) => {
  console.log(`Server error: ${error.message}`);
});

module.exports = app;
