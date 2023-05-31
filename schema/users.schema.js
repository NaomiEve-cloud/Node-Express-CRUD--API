const Joi = require('joi');

//###############################################
//          {User Section}
//###############################################.

//User Register Validation
const registerSchema = Joi.object({
    full_name: Joi.string().required(),
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3),
    nationality: Joi.string().empty(''),
    marital_status: Joi.string().empty(''),
    occupation: Joi.string().empty(''),
});


//Login Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});

module.exports = {
    registerSchema,
    loginSchema
}
