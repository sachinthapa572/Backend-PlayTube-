import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { allowedTypesFileTypes } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp/");
  },
  filename: (req, file, cb) => {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = uuidv4();
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${uniqueSuffix}-${safeFilename}.${fileExtension}`);
  },
});

// cb(a)==> error   cb(a, b) ==> sucess
// File filter to accept only specific file types (e.g., images and videos)
function fileFilter(req, file, cb) {
  try {
    const mimeType = file.mimetype;

    // Validate MIME type
    if (!allowedTypesFileTypes.includes(mimeType)) {
      return cb(
        new ApiError(
          415,
          "Invalid file type. Only JPG, PNG ,JPEG , MP4  files are allowed."
        )
      );
    }
    cb(null, true);
  } catch (error) {
    cb(new ApiError(500, "Error processing file."));
  }
}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export { upload };
