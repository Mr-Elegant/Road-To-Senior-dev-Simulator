const { z } = require('zod');

const TelemetryPayloadSchema = z.object({
  stationId: z.string().uuid(),
  timestamp: z.string().datetime(),
  powerKw: z.number().positive().max(350),
  temperatureC: z.number().min(-40).max(120),
  status: z.enum(['CHARGING', 'IDLE', 'FAULT', 'OFFLINE']),
  firmwareVersion: z.string().regex(/^v\d+\.\d+\.\d+$/),
}).strict(); // Strips or rejects unexpected keys (prevents mass-assignment)

function validateRequestMiddleware(schema) {
  return (req, res, next) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return res.status(400).json({
        type: 'https://api.example.com/errors/validation-failed',
        title: 'Invalid Request Payload',
        status: 400,
        errors: formattedErrors,
      });
    }

    req.validatedBody = parseResult.data;
    next();
  };
}
