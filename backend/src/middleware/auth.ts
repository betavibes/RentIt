import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  console.log('Auth middleware - Authorization header:', authHeader);

  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    console.log('Auth middleware - No token found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    console.log('Auth middleware - Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware - Token verification failed:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Export aliases for convenience
export const authenticate = authMiddleware;
