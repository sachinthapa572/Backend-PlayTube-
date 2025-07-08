import { v2 as cloudinary } from 'cloudinary';
import { safeUnlinkSync } from './fileUtils';

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

const uploadOnCloudinary = async (filePath: string, folder: string) => {
  try {
    if (!filePath) return null;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      asset_folder: `PlayTube/${folder}`,
    });
    console.log('File Upload Successful', result.url);
    safeUnlinkSync(filePath);
    return result;
  } catch (error) {
    safeUnlinkSync(filePath);
    console.error('cloudinary Upload Error !! ', error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('File Delete Successful', result);
    return result;
  } catch (error) {
    console.error('cloudinary Delete Error !! ', error);
    return null;
  }
};
export { deleteFromCloudinary, uploadOnCloudinary };
