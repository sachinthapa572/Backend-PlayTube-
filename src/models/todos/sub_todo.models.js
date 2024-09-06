import mongoose, { Mongoose } from 'mongoose';
const SubTodoSchema = new Mongoose.Schema(
	{
		content: {
			type: String,
			require: true,
		},
		complete: {
			type: Boolean,
			default: false,
		},
		createdBy: {
			// refrence to the user model
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export const Subtodo = Mongoose.model('Subtodo', SubTodoSchema);
