import mongoose from 'mongoose';

const MONGO_URL =
	'mongodb+srv://adminadmin:BGz7LXh0nsftg0fX@project.mzyde.mongodb.net';
const connectdb = async () => {
	try {
		const connectionInstance = await mongoose.connect(MONGO_URL);
		console.log(
			` MongoDB connected !! DB Name:${connectionInstance.connection.name}`
		);
		// console.log(connectionInstance);
	} catch (error) {
		throw new Error('Something went wrong');
	}
};

export default connectdb;
