import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_DB: Joi.required(),
  PORT: Joi.number().default(8000),
  DEFAULT_LIMIT: Joi.number().default(18),
});

//Valida el objeto de las variables de entorno
