import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
const connectdb = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MOGO_URI}/${process.env.MOGO_DB_NAME}`
		);
		console.log(
			` MongoDB connected !! DB Name:${connectionInstance.connection.name}`
		);
		// console.log(connectionInstance);
	} catch (error) {
		throw new Error('Something went wrong');
	}
};

export default connectdb;
