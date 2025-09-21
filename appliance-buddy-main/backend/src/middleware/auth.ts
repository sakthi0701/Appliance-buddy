import { Request, Response, NextFunction } from 'express'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
      }
    }
  }
}

// Authentication middleware placeholder
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement Supabase JWT verification
    // For now, just proceed without authentication
    console.log('Authentication middleware - TODO: implement Supabase JWT verification')
    
    // Example of what this middleware would do:
    // 1. Extract JWT token from Authorization header
    // 2. Verify token with Supabase
    // 3. Extract user information
    // 4. Attach user to request object
    
    // Mock user for development (remove this in production)
    req.user = {
      id: 'mock-user-id',
      email: 'mock@example.com'
    }
    
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// Authorization middleware to check if user owns resource
export const authorizeResource = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // TODO: Implement resource ownership checks
  console.log('Authorization middleware - TODO: implement resource ownership checks')
  next()
}