import fs from 'fs';
import path from 'path';
import { safeUnlinkSync } from './fileUtils.js';

const removeMulterUploadFiles = (files) => {
	if (!files) return;

	Object.values(files).forEach((fileArray) => {
		fileArray.forEach((file) => {
			const filePath = path.normalize(file.path);
			safeUnlinkSync(filePath);
		});
	});
};

export { removeMulterUploadFiles };
