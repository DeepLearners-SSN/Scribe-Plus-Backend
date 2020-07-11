const Joi = require('@hapi/joi');


module.exports.doctorSchema = Joi.object({
    name: Joi.string().required(),
    phno: Joi.number().min(10).max(10).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required()
});

module.exports.doctorLoginSchema = Joi.object({
    address: Joi.string().required(),
    password: Joi.string().min(8).required()
});