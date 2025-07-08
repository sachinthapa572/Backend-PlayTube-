
import path from 'path';
import { safeUnlinkSync } from './fileUtils';

const removeMulterUploadFiles = (files: Array<{ path: string }>) => {
  if (!files) return;

  if (Array.isArray(files)) {
    files.forEach((file) => {
      const filePath = path.normalize(file.path);
      safeUnlinkSync(filePath);
    });
  } else {
    Object.values(files).forEach((fileArray) => {
      if (Array.isArray(fileArray)) {
        fileArray.forEach((file) => {
          const filePath = path.normalize(file.path);
          safeUnlinkSync(filePath);
        });
      }
    });
  }
};

export { removeMulterUploadFiles };
