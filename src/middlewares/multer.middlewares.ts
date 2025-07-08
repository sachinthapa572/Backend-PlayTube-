import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { allowedTypesFileTypes } from '@/constants';
import { ApiError } from '@/utils/ApiError';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, './public/temp/');
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = uuidv4();
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}-${safeFilename}.${fileExtension}`);
  },
});

// cb(a)==> error   cb(a, b) ==> sucess
// File filter to accept only specific file types (e.g., images and videos)
function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  try {
    const mimeType = file.mimetype;

    // Validate MIME type
    if (!allowedTypesFileTypes.includes(mimeType)) {
      return cb(
        new ApiError(415, 'Invalid file type. Only JPG, PNG ,JPEG , MP4  files are allowed.'),
      );
    }
    cb(null, true);
  } catch (error) {
    cb(new ApiError(500, 'Error processing file.'));
  }
}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export { upload };
