import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { EMAIL_REGEX } from '../constants.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, fullName, password } = req.body;
	// validation
	console.log(req.body);
	console.log(req.files);
	if (
		[username, email, fullName, password].some(
			(field) => field?.trim() === ''
		)
	) {
		throw new ApiError(400, 'All fields are required');
	}

	if (!email.match(EMAIL_REGEX)) {
		throw new ApiError(400, 'Invalid emai ');
	}

	// if the user exist already or not
	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});
	if (existedUser) {
		throw new ApiError(409, 'User already Existed ');
	}

	const avtarLocalPath = req.files?.avatar[0]?.path;
	const coverImageLocalPath = req.files?.coverImage[0]?.path;

	if (!avtarLocalPath) {
		throw new ApiError(400, 'avatar Image is required ');
	}

	// upload on the cloudinary
	const avatar = await uploadOnCloudinary(avtarLocalPath);
	const coverImage = await uploadOnCloudinary(coverImageLocalPath);

	if (!avatar) {
		throw new ApiError(400, 'avatar Image is required ');
	}

	const user = await User.create({
		fullName,
		avatar: avatar.url,
		coverImage: coverImage?.url || '',
		email,
		password,
		username: username.toLowerCase(),
	});

	// check the user is created or not
	// not to give the refresh token and the password to the frontend
	const curretUser = await User.findById(user._id).select(
		'-password -refreshToken'
	);

	if (!curretUser) {
		throw new ApiError(
			500,
			'something went wrong while creating the user  '
		);
	}
	return res
		.status(201)
		.json(
			new ApiResponse(
				200,
				curretUser,
				'User Register Sucessfully '
			)
		);
});

export { registerUser };
