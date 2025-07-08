import fs from 'fs';
import path from 'path';
import { ApiError } from './ApiError';

const BASE_UPLOAD_DIR: string = path.resolve(__dirname, '../public/temp');

// Function to safely delete a file synchronously
const safeUnlinkSync = (filePath: string) => {
  try {
    // Resolve to an absolute path
    const resolvedPath = path.resolve(BASE_UPLOAD_DIR, filePath);

    // Ensure the resolved path is within the base upload directory
    if (!resolvedPath.startsWith(BASE_UPLOAD_DIR)) {
      throw new ApiError(400, 'Path traversal attempt detected');
    }

    // Check if the file exists before trying to delete it
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
    }
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new ApiError(500, 'Something went wrong , Please try again ');
  }
};

export { safeUnlinkSync };
