const { GoogleGenAI } = require('@google/genai');

const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

const PLATE_RECOGNITION_PROMPT = `
Analiza la fotografía e identifica una única placa vehicular visible.

Reglas:
- Devuelve la placa en mayúsculas.
- Elimina espacios, guiones y signos.
- Conserva únicamente letras de la A a la Z y números del 0 al 9.
- No inventes caracteres que no sean legibles.
- Si no hay una placa o no puede leerse con suficiente claridad,
  indica detected como false y vehicle_plate como una cadena vacía.
`;

const createServiceError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw createServiceError(
      'La integración con Gemini no está configurada.',
      503
    );
  }

  return new GoogleGenAI({ apiKey });
};


const normalizePlate = (value) => {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
};

const recognizeLicensePlate = async ({ imageBase64, mimeType }) => {
  try {
    const client = getGeminiClient();

    const interaction = await client.interactions.create({
      model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
      store: false,
      input: [
        {
          type: 'image',
          mime_type: mimeType,
          data: imageBase64
        },
        {
          type: 'text',
          text: PLATE_RECOGNITION_PROMPT
        }
      ],
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: {
          type: 'object',
          properties: {
            detected: {
              type: 'boolean'
            },
            vehicle_plate: {
              type: 'string'
            }
          },
          required: ['detected', 'vehicle_plate'],
          additionalProperties: false
        }
      }
    });

    const parsedResult = JSON.parse(interaction.output_text || '{}');
    const vehiclePlate = normalizePlate(parsedResult.vehicle_plate);

    if (
      parsedResult.detected !== true ||
      vehiclePlate.length < 5 ||
      vehiclePlate.length > 15
    ) {
      throw createServiceError(
        'No fue posible reconocer una placa con suficiente claridad.',
        422
      );
    }

    return {
      vehicle_plate: vehiclePlate
    };
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }

    if (
      error.status === 429 ||
      error.statusCode === 429 ||
      error.code === 429
    ) {
      throw createServiceError(
        'Se alcanzó temporalmente el límite de uso de Gemini.',
        429
      );
    }

    console.error('Error al consultar Gemini:', error.message);

    throw createServiceError(
      'No fue posible analizar la imagen con Gemini.',
      502
    );
  }
};

module.exports = {
  recognizeLicensePlate
};
