import { User } from '../../models/user.models.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { __PhotoDir, EMAIL_REGEX } from '../../constants.js';
import { removeMulterUploadFiles } from '../../utils/removeMulterUploadFiles.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { generateAccessTokenAndRefreshToken } from '../../utils/authTokenGenerator.js';
import handleImageUpload from '../../utils/handleImageUploadUtils.js';

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, fullName, password } = req.body;
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
		throw new ApiError(400, 'Invalid email format');
	}

	// if the user exist already or not
	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existedUser) {
		removeMulterUploadFiles(req.files);
		throw new ApiError(409, 'Name already Taken');
	}

	const avtarLocalPath = req.files?.avatar
		? req.files.avatar[0]?.path
		: null;
	const coverImageLocalPath = req.files?.coverImage
		? req.files.coverImage[0]?.path
		: null;

	if (!avtarLocalPath) {
		removeMulterUploadFiles(req.files);
		throw new ApiError(400, 'Avatar Image is required ');
	}

	// upload on the cloudinary
	// const avatar = await uploadOnCloudinary(avtarLocalPath);
	const avatar = await handleImageUpload(
		avtarLocalPath,
		null,
		__PhotoDir.AVATAR
	);
	let coverImage = null;
	if (coverImageLocalPath) {
		coverImage = await handleImageUpload(
			coverImageLocalPath,
			null,
			__PhotoDir.COVERIMAGE
		);
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
			'something went wrong while creating the user'
		);
	}
	return res
		.status(201)
		.json(
			new ApiResponse(201, curretUser, 'User Register Sucessfully')
		);
});

const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	// console.log(email, password);
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
		await generateAccessTokenAndRefreshToken(Currentuser._id, next);

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

	// check if the new password is same as the old password by send the new password to the isPasswordCorrect method
	if (await user.isPasswordCorrect(newPassword)) {
		throw new ApiError(
			400,
			'New password cannot be the same as the old password try different password'
		);
	}

	// validation for the password
	if (
		!newPassword.match(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
		)
	) {
		throw new ApiError(
			400,
			'Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number'
		);
	}

	// set the new password
	user.password = newPassword;
	await user.save({
		validateBeforeSave: false, // bypass the validation
	});

	return res
		.status(200)
		.json(new ApiResponse(200, {}, 'Password Change Sucessfully'));
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
		throw new ApiError(400, 'Image is required ');
	}
	const oldUserData = await User.findById(req.user?._id);

	const avatar = handleImageUpload(
		avatarLocalPath,
		oldUserData.avatar,
		__PhotoDir.AVATAR
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
		throw new ApiError(400, 'Image is required');
	}
	const oldUserData = await User.findById(req.user?._id);
	const currentImage = oldUserData.coverImage
		? oldUserData.coverImage
		: undefined;

	handleImageUpload(
		coverImageLocalPath,
		currentImage,
		__PhotoDir.COVERIMAGE
	);

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

const getProfileInformation = asyncHandler(async (req, res) => {
	const { username } = req.params;

	if (!username?.trim()) {
		throw new ApiError(403, 'Channel name is required');
	}

	// Aggregation pipeline
	const channelInfo = await User.aggregate([
		{
			$match: {
				username: username.toLowerCase().trim(),
			},
		},
		// Lookup for Subscribers (users subscribed to this user)
		// lookup is the left join or simple join
		{
			$lookup: {
				from: 'subscriptions',
				localField: '_id',
				foreignField: 'subscriber',
				as: 'Subscribers',
			},
		},
		// Lookup for SubscribeTo (users this user is subscribed to)
		{
			$lookup: {
				from: 'subscriptions',
				localField: '_id',
				foreignField: 'channel',
				as: 'SubscribeTo',
			},
		},
		// adding the additional field to the above field
		{
			$addFields: {
				subscriberCount: { $size: '$Subscribers' },
				subscribedTOCount: { $size: '$SubscribeTo' },
				isSubscribedTo: {
					$cond: [
						{ $in: [req.user._id, '$Subscribers.subscriber'] },
						true,
						false,
					], // Checking if the current user is in the Subscribers list
				},
			},
		},
		// Project specific fields to return or send the specifc field (k k return garne vanerw )
		{
			$project: {
				username: 1,
				email: 1,
				fullName: 1,
				avatar: 1,
				coverImage: 1,
				subscriberCount: 1,
				subscribedTOCount: 1,
				isSubscribedTo: 1,
			},
		},
	]);

	// Check if the channel exists
	if (!channelInfo.length) {
		throw new ApiError(404, 'Channel does not exist');
	}
	res.status(200).json(
		new ApiResponse(
			200,
			channelInfo[0],
			'User channel fetched successfully'
		)
	);
});

const getWatchHistory = asyncHandler(async (req, res) => {
	// Aggregation pipeline ==> this will get the array of the data
	if (!mongoose.isValidObjectId(req.user._id)) {
		return res
			.status(400)
			.json(new ApiResponse(400, null, 'Invalid User ID'));
	}

	// Aggregation pipeline
	const user = await User.aggregate([
		{
			$match: {
				// _id: mongoose.Types.ObjectId(req.user._id),
				_id: mongoose.Types.ObjectId(req.user._id),
			},
		},
		{
			$lookup: {
				from: 'videos',
				localField: 'watchHistory',
				foreignField: '_id',
				as: 'watchHistory',
				pipeline: [
					{
						$lookup: {
							from: 'users',
							localField: 'owner',
							foreignField: '_id',
							as: 'owner',
							pipeline: [
								{
									$project: {
										fullName: 1,
										username: 1,
										avatar: 1,
									},
								},
							],
						},
					},
					{
						$addFields: {
							owner: { $arrayElemAt: ['$owner', 0] },
						},
					},
					{
						$project: {
							title: 1,
							description: 1,
							createdAt: 1,
							owner: 1,
						},
					},
				],
			},
		},
	]);

	if (!user.length || !user[0]?.watchHistory) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'Watch History not found'));
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				user[0]?.watchHistory,
				'Watch History fetched successfully'
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
	getProfileInformation,
	getWatchHistory,
};
