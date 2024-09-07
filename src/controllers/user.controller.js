import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { EMAIL_REGEX } from '../constants.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { removeFiles } from '../utils/removeFiles.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		// required field ne magcha so to avoide that use validateBeforeSave(bypass validation)
		await user.save({
			validateBeforeSave: false,
		});
		return {
			refreshToken,
			accessToken,
		};
	} catch (error) {
		throw new ApiError(
			500,
			'Something went wrong while generating the Token '
		);
	}
};

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, fullName, password } = req.body;
	// console.log(req.body);
	// console.log(req.files);
	// validation
	if (
		[username, email, fullName, password].some(
			(field) => !field || field.trim() === ''
		)
	) {
		removeFiles(req.files);
		throw new ApiError(400, 'All fields are required');
	}

	if (!email.match(EMAIL_REGEX)) {
		removeFiles(req.files);
		throw new ApiError(400, 'Invalid email ');
	}

	// if the user exist already or not
	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});
	if (existedUser) {
		removeFiles(req.files);
		throw new ApiError(409, 'User already Existed ');
	}

	const avtarLocalPath = req.files?.avatar
		? req.files.avatar[0]?.path
		: null;
	const coverImageLocalPath = req.files?.coverImage
		? req.files.coverImage[0]?.path
		: null;

	if (!avtarLocalPath) {
		removeFiles(req.files);
		throw new ApiError(400, 'avatar Image is required ');
	}

	// upload on the cloudinary
	const avatar = await uploadOnCloudinary(avtarLocalPath);
	let coverImage = null;
	if (coverImageLocalPath) {
		coverImage = await uploadOnCloudinary(coverImageLocalPath);
	}

	if (!avatar) {
		throw new ApiError(400, 'avatar Image is required ');
	}

	// create a user
	const user = await User.create({
		fullName,
		avatar: avatar.url,
		coverImage: coverImage ? coverImage?.url : '',
		email,
		password,
		username: username.toLowerCase(),
	});

	// check the user is created or not
	// not to give the refresh token and the password(sensitive info) to the frontend select("-name" "-name") to not fetch the data
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
			new ApiResponse(201, curretUser, 'User Register Sucessfully')
		);
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	console.log(email, password);
	// return;
	if (!email) {
		throw new ApiError(400, 'Email is required ');
	}
	if (!email.match(EMAIL_REGEX)) {
		removeFiles(req.files);
		throw new ApiError(400, 'Invalid email format');
	}

	const Currentuser = await User.findOne({ email });
	if (!Currentuser) {
		throw new ApiError(404, 'User doesnot exist');
	}

	// validate the password
	// User.findOne chai mogodb ko method ho so use it with the schema name and isPasswordCorrect hamle define gare ko method ho so object bata access garne
	const isPasswordValid =
		await Currentuser.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ApiError(401, 'Incorrect Password');
	}

	// get the access and the refresh token
	const { refreshToken, accessToken } =
		await generateAccessTokenAndRefreshToken(Currentuser._id);

	//  getting the information of the user after the access and refresh token generated
	const loginedInUser = await User.findById(Currentuser._id).select(
		'-password -refreshToken'
	);

	// setting the cookies
	const options = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.cookie('accessToken', accessToken, options)
		.cookie('refreshToken', refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loginedInUser,
					refreshToken,
					accessToken,
				},
				'User loged In Sucessfully '
			)
		);
});

const logedOutUser = asyncHandler(async (req, res) => {
	const _id = req.user?._id;
	await User.findByIdAndUpdate(
		_id,
		{
			$set: {
				refreshToken: undefined,
			},
		},
		{
			new: true, // return the new updated value else it would return the same accesToken value
		}
	);
	const options = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.clearCookie('accessToken', options)
		.clearCookie('refreshToken', options)
		.json(new ApiResponse(200, {}, 'Sucessfully logout '));
});

export { registerUser, loginUser, logedOutUser };
