import { ApiError } from '@/utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

const validateObjectId = (req: Request, _res: Response, next: NextFunction) => {
  const id = req.params.id || req.query.id || req.body._id;

  if (id) {
    // Check if it's a valid ObjectId
    if (!ObjectId.isValid(id)) {
      next(new ApiError(400, 'Invalid ID provided'));
    }
    // req.params.id = ObjectId.createFromHexString(id);
    req.params.id = id;
  }

  next();
};

export default validateObjectId;
