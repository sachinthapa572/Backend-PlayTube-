import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler(async (req, res, next) => {
	// or part chai  for the mbl  as it dont have the cookies // postman bata test garda ne
	try {
		const token =
			req.cookies?.accessToken ||
			req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			throw new ApiError(401, 'Unauthorized request');
		}

		const decodedToken = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET
		);
		const _id = decodedToken?._id;
		const user = await User.findById(_id).select(
			'-password -refreshToken'
		);

		if (!user) {
			throw new ApiError(401, 'Invalid Access Toen ');
		}
		req.user = user;
		next();
	} catch (error) {
		throw new ApiError(401, 'Invalid Access Tokenv ');
	}
});

export { verifyJWT };
