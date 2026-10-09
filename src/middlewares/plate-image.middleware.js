const VALID_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const MAX_IMAGE_BASE64_LENGTH = 7_000_000;

const validatePlateImage = (req, res, next) => {
  const errors = [];
  const { image_base64, mime_type } = req.body;

  if (!image_base64 || typeof image_base64 !== 'string') {
    errors.push('La imagen de la placa es requerida');
  } else if (image_base64.length > MAX_IMAGE_BASE64_LENGTH) {
    errors.push('La imagen supera el tamaño máximo permitido');
  }

  if (!mime_type || !VALID_IMAGE_MIME_TYPES.includes(mime_type)) {
    errors.push('El formato de imagen debe ser JPEG, PNG o WEBP');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Error de validación',
      errors
    });
  }

  return next();
};

module.exports = {
  validatePlateImage
};
