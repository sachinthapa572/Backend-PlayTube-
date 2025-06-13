import fs from 'fs';
import path from 'path';
import { ApiError } from './ApiError.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const BASE_UPLOAD_DIR = path.resolve(__dirname, '../public/temp');

// Function to safely delete a file synchronously
const safeUnlinkSync = (filePath) => {
	try {
		// Resolve to an absolute path
		const resolvedPath = path.resolve(BASE_UPLOAD_DIR, filePath);

		// Ensure the resolved path is within the base upload directory
		if (!resolvedPath.startsWith(BASE_UPLOAD_DIR)) {
			throw new ApiError('Path traversal attempt detected');
		}

		// Check if the file exists before trying to delete it
		if (fs.existsSync(resolvedPath)) {
			fs.unlinkSync(resolvedPath);
		}
	} catch (error) {
		console.error('Error deleting file:', error);
		throw new ApiError('Something went wrong , Please try again ');
	}
};

export { safeUnlinkSync };
