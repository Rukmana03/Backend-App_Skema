const successResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  const errorResponse = (res, statusCode, message, error = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  };

  const throwError = (status, message) =>{
    const error = new Error(message);
    error.status = status;
    throw error;
  }
  
  module.exports = { successResponse, errorResponse, throwError };
  