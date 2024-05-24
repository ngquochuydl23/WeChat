const Joi = require('joi');

const schema = Joi.object({
  phoneNumber: Joi
    .string()
    .pattern(new RegExp(/^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/))
    .messages({
      'string.empty': `"phoneNumber" cannot be an empty field`,
      'string.required': `"phoneNumber" is a required field`,
      'string.pattern.base': `"phoneNumber" is not valid`
    }),
  email: Joi
    .string()
    .email()
    .messages({
      'string.empty': `"email" cannot be an empty field`,
      'string.required': `"email" is a required field`,
      'string.email': `"email" is not valid`
    }),
  fullName: Joi
    .string()
    .required()
    .messages({
      'string.empty': `"fullName" cannot be an empty field`,
      'string.required': `"fullName" is a required field`
    }),
})

module.exports = { schema }
