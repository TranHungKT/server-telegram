import { NextFunction, Request, Response } from 'express';

// import { validateRequest } from '@Utils'
export const basicController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // await validateRequest()
    res.send('OK');
  } catch (error) {
    return next(error);
  }
};
