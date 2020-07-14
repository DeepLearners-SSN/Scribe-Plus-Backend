const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { date } = require('@hapi/joi');

module.exports.doctorSchema = Joi.object({
    name: Joi.string().required(),
    phno: Joi.string().min(10).max(10).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required()
});

module.exports.doctorLoginSchema = Joi.object({
    address: Joi.string().required(),
    password: Joi.string().min(8).required()
});

module.exports.appointmentSchemaCheck = Joi.object({
    doctorAddress : Joi.string().required(),
    patientQrCode : Joi.string().required(),
    time : Joi.string().required()
});

const appointmentSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    doctorAddress : String,
    patientQrCode : String,
    appointmentNumber : Number,
    time : Date,
    visited : Boolean
});

module.exports.appointmentSchema = mongoose.model('Appointment', appointmentSchema);