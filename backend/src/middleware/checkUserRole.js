const jwt = require("jsonwebtoken");
const db = require("../../models/index");

const { Roles } = db;

const checkUserRole =
  (...roles) =>
  async (req, res, next) => {
    try {
      if (!req.headers.authorization) throw new Error("First Login !!!");

      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);

      const userRole = await Roles.findOne({ where: { id: decoded.roleId } });

      if (!userRole) {
        res.status(404).send({ message: "Role not found" });
        return;
      }

      if (roles.includes(userRole.name)) {
        next();
      } else {
        res.status(403).send({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// Middleware to authenticate session token
function authenticateToken(req, res, next) {
  const token = req.cookies.sessionToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded; // Set req.user with decoded token data
    next();
  });
}

module.exports = checkUserRole;
