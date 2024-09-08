import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { EMAIL_REGEX } from '../constants.js';
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from '../utils/cloudinary.js';
import { removeMulterUploadFiles } from '../utils/removeMulterUploadFiles.js';
import jwt from 'jsonwebtoken';

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
		removeMulterUploadFiles(req.files);
		throw new ApiError(400, 'All fields are required');
	}

	if (!email.match(EMAIL_REGEX)) {
		removeMulterUploadFiles(req.files);
		throw new ApiError(400, 'Invalid email ');
	}

	// if the user exist already or not
	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});
	if (existedUser) {
		removeMulterUploadFiles(req.files);
		throw new ApiError(409, 'User already Existed ');
	}

	const avtarLocalPath = req.files?.avatar
		? req.files.avatar[0]?.path
		: null;
	const coverImageLocalPath = req.files?.coverImage
		? req.files.coverImage[0]?.path
		: null;

	if (!avtarLocalPath) {
		removeMulterUploadFiles(req.files);
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
		removeMulterUploadFiles(req.files);
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

const RefreshAcessToken = asyncHandler(async (req, res) => {
	const recivedToken =
		req.cookies.refreshToken || req.body.refreshToken;
	// console.log(recivedToken);
	if (!recivedToken) {
		throw new ApiError(401, 'Unauthorized request');
	}

	const decodedToken = jwt.verify(
		recivedToken,
		process.env.REFRESH_TOKEN_SECRET
	);
	console.log(decodedToken);

	const user = await User.findById(decodedToken?._id);

	if (!user) {
		throw new ApiError(401, 'Invalid Refresh Token');
	}
	// compare the refreshtoken send by the user and in the database one
	if (recivedToken !== user?.refreshToken) {
		throw new ApiError(401, 'refresh token is expired');
	}
	const options = {
		httpOnly: true,
		secure: true,
	};
	const { refreshToken, accessToken } =
		await generateAccessTokenAndRefreshToken(user._id);
	return res
		.status(200)
		.cookie('accessToken', accessToken, options)
		.cookie('refreshToken', refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					refreshToken,
					accessToken,
				},
				'Token refresh Sucessfully'
			)
		);
});

//!check
const changeCurrentPassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new ApiError(
			400,
			'Both old and new passwords are required'
		);
	}

	const user = await User.findById(req.user?._id);
	// comparing the password
	const isPasswordCorrect =
		await user.isPasswordCorrect(oldPassword);

	if (!isPasswordCorrect) {
		throw new ApiError(404, 'Incorrect old Password');
	}

	if (await user.isPasswordCorrect(newPassword)) {
		throw new ApiError(
			400,
			'New password cannot be the same as the old password'
		);
	}
	user.password = newPassword;
	await user.save({
		validateBeforeSave: false,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, {}, 'Password change Sucessfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
	// req.user chai middleware bata aako ho
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, 'User fetch Sucessfully'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
	const { fullName, email, username } = req.body;
	if (!fullName && !email && !username) {
		throw new ApiError(400, 'At least one field is required');
	}
	const currentUser = await User.findById(req.user?._id);
	if (!currentUser) {
		throw new ApiError(404, 'User not found');
	}
	const user = await User.findByIdAndUpdate(
		req.user?._id,
		{
			$set: {
				fullName: fullName || currentUser.fullName,
				email: email || currentUser.email,
				username: username || currentUser.username,
			},
		},
		{
			new: true,
			runValidators: true,
		}
	).select('-password -refreshToken');

	if (!user) {
		throw new ApiError(
			500,
			'Something went wrong while updating the user'
		);
	}
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				user,
				'User Details Updated Sucessfully'
			)
		);
});

const Updateavatar = asyncHandler(async (req, res) => {
	const avatarLocalPath = req.file ? req.file?.path : null;
	if (!avatarLocalPath) {
		removeMulterUploadFiles();
		throw new ApiError(400, 'avatar Image is required ');
	}
	// upload on the cloudinary
	const avatar = await uploadOnCloudinary(avatarLocalPath);
	if (!avatar?.url) {
		throw new ApiError(
			400,
			'Error while uploading the avatar image'
		);
	}
	const oldUserData = await User.findById(req.user?._id);

	// removed the image from the cloudinary

	await deleteFromCloudinary(
		oldUserData?.avatar.split('/').pop().split('.')[0]
	);

	// update the user
	const updatedUser = await User.findByIdAndUpdate(
		req.user?._id,
		{
			$set: {
				avatar: avatar?.url,
			},
		},
		{
			new: true,
		}
	).select('-password -refreshToken');

	if (!updatedUser) {
		throw new ApiError(500, 'Error while updating the user avatar');
	}
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				updatedUser,
				'User Avatar Updated Sucessfully'
			)
		);
});

const UpdateCoverImage = asyncHandler(async (req, res) => {
	const coverImageLocalPath = req.file ? req.file?.path : null;

	if (!coverImageLocalPath) {
		throw new ApiError(400, 'Cover Image is required');
	}

	const coverImage = await uploadOnCloudinary(coverImageLocalPath);
	if (!coverImage?.url) {
		throw new ApiError(
			400,
			'Error while uploading the Cover Image'
		);
	}
	const oldUserData = await User.findById(req.user?._id);
	// removed the image from the cloudinary
	if (oldUserData.coverImage) {
		await deleteFromCloudinary(
			oldUserData?.coverImage.split('/').pop().split('.')[0]
		);
	}

	const user = await User.findByIdAndUpdate(
		req.user?._id,
		{
			$set: {
				coverImage: coverImage?.url,
			},
		},
		{
			new: true,
		}
	).select('-password -refreshToken');

	if (!user) {
		throw new ApiError(
			500,
			'Something went wrong while updating the user'
		);
	}
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				user,
				'User Cover Image Updated Sucessfully'
			)
		);
});

export {
	registerUser,
	loginUser,
	logedOutUser,
	RefreshAcessToken,
	getCurrentUser,
	changeCurrentPassword,
	updateAccountDetails,
	UpdateCoverImage,
	Updateavatar,
};
