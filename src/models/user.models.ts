import { appEnv } from '@/config/appenv';
import Bun from 'bun';
import jwt from 'jsonwebtoken';
import mongoose, { type Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  password: string;
  refreshToken?: string;
  watchHistory: mongoose.Schema.Types.ObjectId[];
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  { timestamps: true },
);

// pre('save') sets up middleware that runs before a document is saved to the database.
userSchema.pre('save', async function (next) {
  // isModified le changed value ho ki nai vanerw check garna lai ho
  if (!this.isModified('password')) return next();
  this.password = await Bun.password.hash(this.password);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await Bun.password.verify(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    appEnv.ACCESS_TOKEN_SECRET,
    {
      expiresIn: appEnv.ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    appEnv.REFRESH_TOKEN_SECRET,
    {
      expiresIn: appEnv.REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};
export const User = mongoose.model<IUser>('User', userSchema);
