import { cookiesOptions } from '@/constants';
import { ApiError } from '@/utils/ApiError';
import { generateAccessTokenAndRefreshToken } from '@/utils/authTokenGenerator';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken =
    req.cookies?.accessToken || req.header('Authorization')?.replace(/^Bearer\s*/, '');
  // x-refresh-token is used for the refresh token in the header
  const refreshToken = req.cookies?.refreshToken || req.header('x-refresh-token');

  // Check if access token is missing but refresh token exists
  if (!accessToken && refreshToken) {
    try {
      const decodedToken: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      );

      // Generate a new access token and refresh token
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await generateAccessTokenAndRefreshToken(decodedToken._id, next);

      // Set the new accessToken and refreshToken in the response object
      res
        .cookie('accessToken', newAccessToken, cookiesOptions)
        .cookie('refreshToken', newRefreshToken, cookiesOptions);

      // Set the new accessToken in the request object
      req.cookies.accessToken = newAccessToken;
    } catch (error) {
      return next(new ApiError(401, 'Unauthorized: Unable to refresh token'));
    }
  }
  next();
};

export default refreshTokenMiddleware;
