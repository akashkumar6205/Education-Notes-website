export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;