const Joi = require('joi');

const schema = Joi.object({
  firstName: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"firstName" cannot be an empty field`,
      'string.required': `"firstName" is a required field`
    }),
  lastName: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"lastName" cannot be an empty field`,
      'string.required': `"lastName" is a required field`
    }),
  phoneNumber: Joi
    .string()
    .pattern(new RegExp(/^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/))
    .messages({
      'string.empty': `"phoneNumber" cannot be an empty field`,
      'string.required': `"phoneNumber" is a required field`,
      'string.pattern.base': `"phoneNumber" is not valid`
    }),
  password: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"password" cannot be an empty field`,
      'string.required': `"password" is a required field`
    }),
  email: Joi
    .string()
    .email()
    .messages({
      'string.empty': `"email" cannot be an empty field`,
      'string.required': `"email" is a required field`,
      'string.email': `"email" is not valid`
    }),
})

module.exports = { schema }
