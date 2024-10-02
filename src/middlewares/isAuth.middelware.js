import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler(async (req, res, next) => {
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
			throw new ApiError(
				401,
				'Unauthorized request: No token provided'
			);
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
			throw new ApiError(
				401,
				'Unauthorized request: User not found'
			);
		}

		req.user = user;
		next();  		// so that the next function is able to run  
	} catch (error) {
		throw new ApiError(
			401,
			'Unauthorized request: Invalid or expired access token'
		);
	}
});

export { verifyJWT };
