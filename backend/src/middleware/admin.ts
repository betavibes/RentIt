import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authorization denied' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
};
