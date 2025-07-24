const jwt = require("jsonwebtoken");
const db = require("../../models/index");

const { User, Role } = db;

const authorize = (...allowedRoles) => async (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(" ")[1];
      console.log('🎫 Token from Authorization header:', token.substring(0, 20) + '...');
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('🎫 Token from cookie:', token.substring(0, 20) + '...');
    }

    if (!token) {
      console.log('❌ No token found in request');
      return res.status(401).json({ message: "Authorization token is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || " _secret_key");
    console.log('🔓 Decoded token:', { userId: decoded.id, roleId: decoded.roleId });

    // Find user with role
    const user = await User.findOne({
      where: { id: decoded.id },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      console.log('❌ User not found:', decoded.id);
      return res.status(403).json({ message: "Invalid user" });
    }

    if (!user.role) {
      console.log('❌ User has no role:', user.id);
      return res.status(403).json({ message: "User has no role assigned" });
    }

    // Map role IDs to role names
    const roleMap = {
      3: 'admin',
      4: 'districtAdministrator',
      2: 'sectorCoordinator'
    };

    const userRole = roleMap[user.roleId];
    if (!userRole) {
      console.log('❌ Invalid role ID:', user.roleId);
      return res.status(403).json({ message: "Invalid role" });
    }

    console.log('👤 User authenticated:', {
      id: user.id,
      role: userRole,
      allowedRoles: allowedRoles
    });

    // Attach user to request
    req.user = {
      id: user.id,
      roleId: user.roleId,
      role: userRole,
      username: user.username,
      email: user.email
    };

    // If no roles specified or user's role is allowed
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      // Add location info based on role
      if (userRole === 'districtAdministrator') {
        req.districtId = user.district_id;
      } else if (userRole === 'sectorCoordinator') {
        req.sectorId = user.sector_id;
        req.districtId = user.district_id;
      }
      return next();
    }

    console.log('🚫 User not authorized:', {
      userRole,
      allowedRoles,
      endpoint: req.originalUrl
    });
    return res.status(403).json({ message: "Unauthorized" });
  } catch (err) {
    console.error('🔥 Auth error:', err.name, err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { authorize };
