class ApiError extends Error {
	constructor(
		statusCode,
		message = 'Something went wrong',
		errors = [],
		stack = ''
	) {
		super(message);
		this.statusCode = statusCode;
		this.data = null;
		this.message = message;
		this.success = false;
		this.errors = errors;
		this.stack = stack|| Error.captureStackTrace(this, this.constructor);;
	}
}

export { ApiError };

// default Error class lai extend gare rw ApiError class banako ho. for the own error handling.

// throw new Error('Not implemented');
