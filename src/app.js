import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(
	express.json({
		limit: '16kb',
	})
);
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public/css'));

// ROUTES
import userRoute from './routes/user.routes.js';
import { ApiError } from './utils/ApiError.js';
app.use('/api/v1/users', userRoute); // http://localhost:800/api/v1/users/{route}


// Error-handling middleware for Express
app.use((err, req, res, next) => {
	if (err instanceof ApiError) {
		// Send JSON response for ApiError
		return res.status(err.statusCode).json({
			success: err.success,
			message: err.message,
			errors: err.errors,
			stack: err.stack,
		});
	}

	// Handle other types of errors (or generic ones)
	return res.status(500).json({
		success: false,
		message: 'Internal server error',
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
	});
});


export { app };
