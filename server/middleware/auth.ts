import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// 31
const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided authorization denied" })
        }
        // If token is aval then verify it
        const token = authHeader.split(" ")[1]
        // After that decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
        req.user = { id: decoded.id }
        next()


    } catch (error) {
      console.log(error)
      return res.status(401).json({message:"Token is not valid"})
    }
}

export default auth;
