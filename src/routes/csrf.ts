import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { generateCSRFToken } from '../middleware/csrf';

const router = Router();

// Get CSRF token
router.get('/token', (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.session?.id;
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Session required for CSRF token',
      });
    }

    const token = generateCSRFToken(sessionId);
    
    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    return next(error);
  }
});

export default router; 