import { User } from '@/models/user.models';
import { ApiError } from '@/utils/ApiError';
import { asyncHandler } from '@/utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

const isAuth = asyncHandler(async (req: CustomRequest, _res: Response, next: NextFunction) => {
  try {
    // or part chai  for the mbl  as it dont have the cookies // postman bata test garda ne
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req
        .header('Authorization')
        ?.replace(/^Bearer\s*/, '')
        .trim();

    if (!token || token === 'undefined') {
      throw new ApiError(401, 'Unauthorized request: No token provided');
    }

    const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    const _id = decodedToken?._id;
    const user = await User.findById(_id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'Unauthorized request: User not found');
    }

    req.user = user;
    next(); // so that the next function is able to run
  } catch (error) {
    throw new ApiError(401, 'Unauthorized request: Invalid or expired access token');
  }
});

export { isAuth };
