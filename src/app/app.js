import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from "morgan"

const app = express();

// ==> 	middelwares	 <== 
app.use(morgan('tiny'))
app.use(cors());
app.use(
	express.json({
		limit: '16kb',
	})
);
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// ROUTES
import userRoute from '../routes/user.routes.js';
import { ApiError } from '../utils/ApiError.js';
app.use('/api/v1/users', userRoute); // http://localhost:800/api/v1/users/{route}

// Error-handling middleware for Express
app.use((err, _, res, next) => {
	if (err instanceof ApiError) {
		// Send JSON response for ApiError
		return res.status(err.statusCode).json({
			success: err.success,
			message: err.message,
			errors: err.errors,
			stack: err.stack,
		});
	}
});

export default app