import * as Joi from 'joi';

export const handlerWrapper = options => {
  const { validate = {}, handler } = validateAndThrow(options, schema);

  return async (e, ctx) => {
    const eventWithDefaults = validateAndThrow(e, validate.e || {});
    return handler(eventWithDefaults, ctx);
  };
};

const validateAndThrow = (e, schema) => {
  const { result, isValid, errors } = validateEvent(e, schema);
  if (!isValid) {
    throw new Error(errors.join(', '));
  }

  return result;
};

const validateEvent = (e, schema) => {
  const result = schema.validate.validate(e, schema);
  const isValid = result.error === null;
  const errors = isValid ? null : result.error.details.map(detail => detail.message);

  return { result: result.value, isValid, errors };
};

const schema = {
  validate: Joi.object({
    e: Joi.object(),
  }),
  handler: Joi.func().maxArity(2),
};
