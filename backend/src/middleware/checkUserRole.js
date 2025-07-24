const jwt = require('jsonwebtoken');
const { User, Role } = require('../../models');
const config = require('../../config/config');

const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'No token provided'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Get user with role
      const user = await User.findOne({
        where: { id: decoded.id },
        include: [{
          model: Role,
          as: 'role',
          attributes: ['name']
        }]
      });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // If no specific roles are required, just check authentication
      if (!allowedRoles.length) {
        req.user = user;
        return next();
      }

      // Check if user's role is allowed
      const userRole = user.role.name;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Attach user and location info to request
      req.user = user;
      if (userRole === 'districtAdministrator') {
        req.districtId = user.district;
      } else if (userRole === 'sectorCoordinator') {
        req.sectorId = user.sector_id;
        req.districtId = user.district;
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
  };
};

module.exports = {
  authorize
}; 