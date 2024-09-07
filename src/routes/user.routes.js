import { Router } from 'express';
import {
	logedOutUser,
	loginUser,
	RefreshAcessToken,
	registerUser,
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

export default router;
