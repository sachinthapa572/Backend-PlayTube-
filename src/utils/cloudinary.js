import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
	try {
		if (!filePath) return;
		const result = await cloudinary.uploader.upload(filePath, {
			resource_type: 'auto',
		});
		console.log(result);
		console.log('File Upload Successful', result.url);
		return result;
	} catch (error) {
		fs.unlinkSync(filePath);
		console.error(error);
		return null;
	}
};

export { uploadOnCloudinary };
