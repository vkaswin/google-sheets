import { Response, Request, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { sign } from "jsonwebtoken";

const colors = [
  "#EF4770",
  "#6F6F6F",
  "#DCB604",
  "#199393",
  "#029ACD",
  "#11C1DA",
  "#3B8FFC",
  "#18C6A0",
  "#B387FF",
  "#F75334",
];

export class CustomError extends Error {
  status!: number;

  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
  }
}

export const asyncHandler = <T>(
  cb: (req: Request, res: Response, next: NextFunction) => T
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error: any) {
      let status =
        error?.status || (error instanceof JsonWebTokenError ? 401 : 500);

      let message = error?.message || "Internal Server Error";

      res.status(status).send({ message });

      console.log("🚀 ~ file: asyncHandler.ts:19 ~ error:", error);
    }
  };
};

export const generateJwtToken = (payload: string | object | Buffer) => {
  return sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const generateRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};
