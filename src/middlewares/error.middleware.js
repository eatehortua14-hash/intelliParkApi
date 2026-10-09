const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: 'Ruta no encontrada.',
    path: req.originalUrl,
    method: req.method
  });
};

const errorHandler = (error, req, res, next) => {
  console.error('Unhandled error:', error);

  return res.status(500).json({
    message: 'Error interno del servidor.'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
