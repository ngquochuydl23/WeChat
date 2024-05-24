const Joi = require('joi');

const schema = Joi.object({
  newPassword: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"newPassword" cannot be an empty field`,
      'string.required': `"newPassword" is a required field`
    }),
  email: Joi
    .string()
    .email()
    .messages({
      'string.empty': `"email" cannot be an empty field`,
      'string.required': `"email" is a required field`,
      'string.email': `"email" is not valid`
    }),
  otp: Joi
    .string()
})

module.exports = { schema }
