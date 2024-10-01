import mongoose, { Mongoose } from 'mongoose';
const todoSchema = new Mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		complete: {
			type: Boolean,
			default: false,
		},
		createdBy: {
			// refrence to the user model
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		subTodos: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Subtodo',
			},
		],
	},
	{ timestamps: true }
);

export const Todo = Mongoose.model('Todo', todoSchema);
