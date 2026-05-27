const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization header format',
    });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Add user details to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("[Authentication_Error]: ", error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// Role authorization middleware
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized. User context missing.',
        });
      }
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, role: true }
      });
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      // Role-based verification
      if (roles.length && !roles.includes(currentUser.role)) {
        return res.status(403).json({
          success: false,
          message: `Forbidden. Requires role: ${roles.join(' or ')}`,
        });
      }

      req.user.role = currentUser.role;

      next();
    } catch (error) {
      console.error("[Authorization_Error]: ", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };
};

const authorizeAdminOnlyLegacy = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizeAdminOnlyLegacy,
};
