import { Request } from 'express';
import { Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  password?: string;
  refreshToken?: string;
  watchHistory: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
}
