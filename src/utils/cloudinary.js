import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { safeUnlinkSync } from "./fileUtils.js";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      asset_folder: `PlayTube/${folder}`,
    });
    // console.log(result);
    console.log("File Upload Successful", result.url);
    safeUnlinkSync(filePath);
    return result;
  } catch (error) {
    safeUnlinkSync(filePath);
    console.error("cloudinary Upload Error !! ", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File Delete Successful", result);
    return result;
  } catch (error) {
    console.error("cloudinary Delete Error !! ", error);
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
