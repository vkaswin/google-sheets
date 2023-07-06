import { Request, Response, NextFunction } from "express";

type CORS = (req: Request, res: Response, next: NextFunction) => void;

let regex = /^(?:https?:\/\/vkaswin\.github\.io|http?:\/\/localhost:\d+)$/;

let allowedHeaders = ["Authorization", "Content-Type"];

const cors: CORS = (req, res, next) => {
  let origin = req.headers.origin;
  let method = req.method;
  console.log(regex.test(origin as string), origin, req.headers);
  if (origin && regex.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  method === "OPTIONS" ? res.status(200).end() : next();
};

export default cors;
