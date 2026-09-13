export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('🔥 [Server Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
