const Joi = require('@hapi/joi');

module.exports.patientSchema = Joi.object({
    name: Joi.string().required(),
    phno: Joi.string().min(10).max(10).required(),
    email: Joi.string().min(6).required().email(),
});

module.exports.patientDetailSchema = Joi.object({
    patientQrCode: Joi.string().required(),
    address: Joi.string().required()
});