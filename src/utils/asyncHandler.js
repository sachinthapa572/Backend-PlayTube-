// try catch block ko alternative

const asyncHandler = (requestHandler) => {
	return (req, res, next) => {
		Promise.resolve(requestHandler(req, res, next)).catch((err) =>
			next(err)
		);
	};
};

export { asyncHandler };

// When next(err) is called, it tells Express to skip the normal route flow and go straight to the error-handling middleware, where you can define how errors are logged and how error responses are sent back to the client.
