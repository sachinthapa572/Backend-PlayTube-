import {
  changeCurrentPassword,
  getCurrentUser,
  getProfileInformation,
  getWatchHistory,
  logedOutUser,
  loginUser,
  RefreshAcessToken,
  registerUser,
  updateAccountDetails,
  Updateavatar,
  UpdateCoverImage,
} from '@/controllers/User/user.controller';
import { isAuth } from '@/middlewares/isAuth.middelware.js';
import { upload } from '@/middlewares/multer.middlewares.js';
import { Router } from 'express';

const userRouter = Router();

userRouter.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser,
);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(isAuth, logedOutUser);
userRouter.route('/update-avatar').patch(isAuth, upload.single('avatar'), Updateavatar);

userRouter.route('/update-coverimage').patch(isAuth, upload.single('coverImage'), UpdateCoverImage);

userRouter.route('/current-user').get(isAuth, getCurrentUser);
userRouter.route('/update-account').patch(isAuth, updateAccountDetails);
userRouter.route('/change-password').patch(isAuth, changeCurrentPassword);

userRouter.route('/refresh-token').post(RefreshAcessToken);

userRouter.route('/channel/:username').get(isAuth, getProfileInformation);

userRouter.route('/history/:username').get(isAuth, getWatchHistory);

export default userRouter;
