const Joi = require('joi');

const schema = Joi.object({
  password: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"password" cannot be an empty field`,
      'string.required': `"password" is a required field`
    }),
  newPassword: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"newPassword" cannot be an empty field`,
      'string.required': `"newPassword" is a required field`
    })
})

module.exports = { schema }
