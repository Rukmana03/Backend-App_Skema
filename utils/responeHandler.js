const successResponse = (res, status, message, data = null) => {
  if (!res || typeof res.status !== "function") {
    console.error("Invalid response object in successResponse");
    return;
  }

  res.status(status).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, status, message, error = null) => {
  if (!res || typeof res.status !== "function") {
    console.error("Invalid response object in errorResponse");
    return;
  }

  const httpStatus = Number.isInteger(status) && status >= 100 && status <= 599 ? status : 500;

  res.status(httpStatus).json({
    success: false,
    message: message || "Terjadi kesalahan",
    error: error instanceof Error ? error.message : error || "Unknown error",
  });
};

const throwError = (status, message = "Terjadi kesalahan") => {
  const httpStatus = Number.isInteger(status) && status >= 100 && status <= 599 ? status : 500;
  const error = new Error(message);
  error.status = httpStatus;
  throw error;
};

module.exports = { successResponse, errorResponse, throwError };
