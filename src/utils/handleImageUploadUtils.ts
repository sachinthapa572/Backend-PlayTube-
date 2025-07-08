// TODO Fix this

import { ApiError } from './ApiError';
import { deleteFromCloudinary, uploadOnCloudinary } from './cloudinary';
import { removeMulterUploadFiles } from './removeMulterUploadFiles';

async function handleImageUpload(
  avatarLocalPath: string | undefined | null,
  currentImage: string | undefined | null,
  folder: string,
): Promise<string | null> {
  if (!avatarLocalPath) return currentImage ?? null;

  const uploadedImage = await uploadOnCloudinary(avatarLocalPath, folder);
  if (!uploadedImage?.url) {
    removeMulterUploadFiles([{ path: avatarLocalPath }]);
    throw new ApiError(500, 'Error uploading image');
  }

  // Delete the previous image if a new one is uploaded while updating
  if (currentImage) {
    await deleteFromCloudinary(currentImage.split('/').pop()?.split('.')[0] as string);
  }

  return uploadedImage.url;
}

export default handleImageUpload;
