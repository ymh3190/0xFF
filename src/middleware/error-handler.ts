import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandlerMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) throw err;
};

export default errorHandlerMiddleware;
