import mongoose from 'mongoose'; // Import mongoose directly

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt
	}
);

export const User = mongoose.model('User', UserSchema); // Use mongoose directly to create the model
