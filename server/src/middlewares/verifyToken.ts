import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { asyncHandler } from "../utils";

type User = {
  _id: string;
  name: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req?.headers?.authorization?.split(`"`)[1];
    if (!token) return res.status(401).send({ message: "Unauthorized" });
    let decoded = await verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as User;
    next();
  }
);

export default verifyToken;
