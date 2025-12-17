import logger from "../config/logger.js";

export default (err, req, res, next) => {
  // Log full error internally
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    timestamp: new Date(),
  });

  const statusCode = err.status || err.statusCode || 500;

  // Sanitize error message for client
  let clientMessage = "Internal server error";

  if (err.message?.includes("Unique constraint")) {
    clientMessage = "This record already exists";
  } else if (err.message?.includes("Record to delete does not exist")) {
    clientMessage = "Record not found";
  } else if (err.message?.includes("not found")) {
    clientMessage = "Resource not found";
  } else if (statusCode < 500) {
    clientMessage = err.message;
  }

  res.status(statusCode).json({
    error: clientMessage,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      originalError: err.message,
    }),
  });
};
