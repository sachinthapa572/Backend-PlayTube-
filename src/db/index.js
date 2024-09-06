import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectdb = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MOGO_URI}/${DB_NAME}`
		);
		console.log(
			`MongoDB connected !! DB Host :${connectionInstance.connection.host}`
		);
		// console.log(connectionInstance);
	} catch (error) {
		console.error('MONODB connection Error', error);
	}
};

export default connectdb;
