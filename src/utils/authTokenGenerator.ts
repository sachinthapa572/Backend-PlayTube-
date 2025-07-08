import { User } from '@/models/user.models';
import { NextFunction } from 'express';
import { ApiError } from './ApiError';

const generateAccessTokenAndRefreshToken = async (userId: string, next: NextFunction) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new ApiError(404, 'User not found'));
      return { accessToken: '', refreshToken: '' }; // Return empty tokens to satisfy type checking
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return {
      refreshToken,
      accessToken,
    };
  } catch (error) {
    next(new ApiError(500, 'Error occurred while generating token'));
    return { accessToken: '', refreshToken: '' }; // Return empty tokens to satisfy type checking
  }
};

export { generateAccessTokenAndRefreshToken };
