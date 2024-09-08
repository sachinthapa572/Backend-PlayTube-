import { Router } from 'express';
import {
	changeCurrentPassword,
	getCurrentUser,
	logedOutUser,
	loginUser,
	RefreshAcessToken,
	registerUser,
	updateAccountDetails,
	Updateavatar,
	UpdateCoverImage,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/isAuth.middelware.js';

const router = Router();

router.route('/register').post(
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
	registerUser
);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logedOutUser);
router.route('/refresh-token').post(RefreshAcessToken);
router
	.route('/update-avatar')
	.patch(upload.single('avatar'), verifyJWT, Updateavatar);

router
	.route('/update-coverimage')
	.patch(upload.single('coverImage'), verifyJWT, UpdateCoverImage);

router.route('/current-user').get(verifyJWT, getCurrentUser);
router
	.route('/update-account')
	.patch(verifyJWT, updateAccountDetails);
router
	.route('/change-password')
	.patch(verifyJWT, changeCurrentPassword);

router.route('/refresh-token').post(RefreshAcessToken);
export default router;
