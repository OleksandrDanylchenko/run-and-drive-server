import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3300),
  STAGE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),

  PG_DB_HOST: Joi.string().required(),
  PG_DB_PORT: Joi.number().default(5432),
  PG_DB_USERNAME: Joi.string().required(),
  PG_DB_PASSWORD: Joi.string().required(),
  PG_DB_DATABASE: Joi.string().required(),
  PG_DB_MIGRATIONS_FOLDER: Joi.string().required(),

  MONGO_DB_HOST: Joi.string().required(),
  MONGO_DB_PORT: Joi.number().default(27017),
  MONGO_DB_USERNAME: Joi.string().required(),
  MONGO_DB_PASSWORD: Joi.string().required(),
  MONGO_DB_DATABASE: Joi.string().required(),
});
