const successResponse = (res, statusCode = 200, message, data = null) => {
  return res.status(statusCode).json(data ? { message, data } : { message });
};

const errorResponse = (res, statusCode = 500, message) => {
  return res.status(statusCode).json({ message });
};

const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports = { successResponse, errorResponse, throwError };
