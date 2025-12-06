export const sendSuccess = (res, message, data = undefined, statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res, message, errors = undefined, statusCode = 400) => {
  const response = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};
