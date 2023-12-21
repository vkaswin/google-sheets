import { Request, Response, NextFunction } from "express";

type CORS = (req: Request, res: Response, next: NextFunction) => void;

let regex =
  /^(?:https?:\/\/(?:vkaswin\.github\.io|localhost:\d+|vercel\.com))$/;

let allowedHeaders = ["Authorization", "Content-Type"];

const cors: CORS = (req, res, next) => {
  let origin = req.headers.origin;
  let method = req.method;

  if (origin && regex.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    res.setHeader("Access-Control-Allow-Credentials", "true");

    return method == "OPTIONS" ? res.status(200).end() : next();
  }

  return !origin ? next() : res.status(403).end();
};

export default cors;
