// sadai same huncha yei ho every time
import multer, { diskStorage } from 'multer';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/temp/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
// cb(a)==> error   cb(a, b) ==> sucess
// File filter to accept only specific file types (e.g., images and videos)
function fileFilter(req, file, cb) {
	const allowedTypes = ['image/jpeg', 'image/png'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true); // accept file
	} else {
		// cb(null, false); // reject file
		cb(
			new Error(
				'Invalid file type. Only JPG, PNG, and MP4 files are allowed.'
			)
		);
	}
}
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 50, // Set file size limit to 50 MB
	},
});

export { upload };

// to handel this error use the middelware

// app.use((err, req, res, next) => {
// 	if (err.code === 'LIMIT_FILE_SIZE') {
// 		return res
// 			.status(413)
// 			.json({ error: 'File size exceeds the limit of 50MB.' });
// 	}
// 	next(err);
// });

//* This ensures that any file uploaded through the multer middleware will be limited to 50 MB. If the file exceeds this limit, multer will throw a LIMIT_FILE_SIZE error.
