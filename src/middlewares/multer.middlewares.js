// sadai same huncha yei ho every time
import { diskStorage } from 'multer';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/temp');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
// cb(a)==> error   cb(a, b) ==> sucess
// File filter to accept only specific file types (e.g., images and videos)
function fileFilter(req, file, cb) {
	const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true); // accept file
	} else {
		cb(null, false); // reject file
		cb(
			new Error(
				'Invalid file type. Only JPG, PNG, and MP4 files are allowed.'
			)
		);
	}
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


// // Initialize multer with the disk storage and file filter
// const upload = multer({
// 	storage: storage,
// 	fileFilter: fileFilter, // Use the custom file filter
// 	limits: {
// 		fileSize: 1024 * 1024 * 50, // Set file size limit to 50 MB
// 	},
// });