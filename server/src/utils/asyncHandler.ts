import { Response, Request, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

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
