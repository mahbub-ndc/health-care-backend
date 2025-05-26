import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }
    const decoded = verify(
      token as string,
      process.env.JWT_ACCESS_SECRET as string
    );
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    const userRole = (decoded as { role: string }).role;
    if (!roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    console.log("Decoded token:", decoded);
    // const user = decoded as { id: string; email: string; role: string };
    req.user = decoded; // Attach user info to the request object
    next();
  };
};
