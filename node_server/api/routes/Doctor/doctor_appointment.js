const express = require('express');
const router = express();
const mongoose = require('mongoose');
const { appointmentSchema,appointmentSchemaCheck }  = require('./doctor_schema');
const { auth } = require('../../middleware/auth');
const logger = require('../../../config/logger');


/**
 * @swagger
 * /api/doctor/appointment/create:
 *   post:
 *      tags:
 *          - doctor
 *      description: to create an appointment for a patient to visit the doctor
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: auth-token
 *         description: auth token got from  login.
 *         in: header
 *         type: string
 *       - in: body
 *         name: doctor
 *         schema :
 *             type: object
 *             required: 
 *                  - time
 *                  - patientQrCode
 *                  - doctorAddress
 *             properties:
 *                  time:
 *                      type: string
 *                      format: YYYY-MM-DDTHH:MM:SSZ
 *                  patientQrCode:
 *                      type: string
 *                  doctorAddress:
 *                      type: string
 *      responses:
 *          200:
 *             description: The appointment is successfully added 
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string                        
 * 
 * 
 * 
 *           
 */
router.post('/create', auth ,(req,res,next) => {
    try {
        const { error } = appointmentSchemaCheck.validate(req.body);
        if(error) {
            logger.log('error',`Doctor Appointment create error ${JSON.stringify(req.body)} error : ${error.details[0].message}`);
            return res.status(400).json({ error:error.details[0].message });
        }
        appointmentSchema.countDocuments({},(err,count) =>{
            console.log(count);
            const appointment = new appointmentSchema({
                _id : mongoose.Types.ObjectId(),
                doctorAddress : req.body.doctorAddress,
                patientQrCode : req.body.patientQrCode,
                appointmentNumber : count+1,
                time : req.body.time,
                questions: [],
                answers: [],
                visited : false,
                answered : false
            });
            appointment.save().then((result)=>{
                console.log("RESULT "+result);
                logger.log('info',`Doctor Appointment created ${JSON.stringify(req.body)}`);
                return res.status(200).json({
                    message: "sucessfully added!",
                });
            }).catch((err)=>{
                console.log("ERROR "+err);
                logger.log('error',`Doctor Appointment create error ${JSON.stringify(req.body)} error : ${err}`);
                res.status(500).json({
                    message : err
                });
            });
        });
    } catch (error) {
        logger.log('error',`Doctor Appointment create error ${JSON.stringify(req.body)} error : ${error}`);
        res.status(500).json({
            message : error
        });
    }
});




/**
 * @swagger
 * /api/doctor/appointment/get:
 *   post:
 *      tags:
 *          - doctor
 *      description: to get all appointments of a doctor
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: auth-token
 *         description: auth token got from  login.
 *         in: header
 *         type: string
 *       - in: body
 *         name: doctor
 *         schema :
 *             type: object
 *             required: 
 *                  - doctorAddress
 *             properties:
 *                  doctorAddress:
 *                      type: string
 *      responses:
 *          200:
 *             description: all the appointments of a doctor is displayed 
 *             schema:
 *                  type: array
 *                  items:
 *                      $ref: "#/definitions/appointment"
 *                                                      
 *
 * definitions:
 *          appointment:
 *            type: object
 *            properties:
 *              _id:
 *                  type: string
 *              doctorAddress:
 *                  type: string
 *              patientQrCode:
 *                  type: string
 *              appointmentNumber:
 *                  type: number   
 *              time:
 *                  type: string
 *              date:
 *                  type: date
 *              visited:
 *                  type: boolean
 *              questions:
 *                  type: array
 *                  items:
 *                      type: string
 *              answers:
 *                  type: array
 *                  items:
 *                      type: string
 *              answered:
 *                  type: boolean
 * 
 *           
 */
router.post('/get', auth, (req,res,next) => {
    try {
        if(req.body.doctorAddress) { 
            appointmentSchema.find({ doctorAddress: req.body.doctorAddress },(err,appointment) => {
                if(err){
                    logger.log('error',`Doctor Appointment  Details API error ${JSON.stringify(req.body)} , error: ${err}`);
                    res.status(400).json({ error:err });
                }
                else
                {
                    logger.log('info',`Doctor Appointment Details API called ${JSON.stringify(req.body)} , appointment: ${JSON.stringify(appointment)}`);
                    res.status(200).json(appointment);
                }
            });
        }
        else{
            logger.log('error',`Doctor Appointment Details API error ${JSON.stringify(req.body)} , error :  Doctor address not specified `);
            return res.status(400).json({ error:"specify the doctor address" });
        }
    } catch (error) {
        logger.log('error',`Doctor Appointment Details API error ${JSON.stringify(req.body)} , error :  ${error}`);
        res.status(500).json({
            message : error
        });
    }
});


/**
 * @swagger
 * /api/doctor/appointment/visited:
 *   put:
 *      tags:
 *          - doctor
 *      description: to make an appointment Visited
 *      consumes:
 *       - application/json
 *      parameters:
 *       - name: auth-token
 *         description: auth token got from  login.
 *         in: header
 *         type: string
 *       - in: body
 *         name: doctor
 *         schema :
 *             type: object
 *             required: 
 *                  - appointmentNumber
 *             properties:
 *                  appointmentNumber:
 *                      type: number
 *      responses:
 *          200:
 *             description: The Appointment is updated
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string                        
 * 
 * 
 * 
 *           
 */
router.put('/visited', auth, (req,res,next) => {
    try{
        if(req.body.appointmentNumber){
            appointmentSchema.updateOne({"appointmentNumber" : req.body.appointmentNumber},{"visited":true},(err,appointment) => {
                logger.log('info',`Appointment Visited ${JSON.stringify(req.body)}`);
                res.status(200).json({message:'appointment updated'});
            });
        }
        else{
            logger.log('error',`Appointment Visited API ERROR ${JSON.stringify(req.body)}, error : Appointment Number not specified`);
            res.status(400).json({message:"Appointment Number not specified"});
        }
    }
    catch(e){
        logger.log('error',`Appointment Visited API ERROR ${JSON.stringify(req.body)}, error : ${e}`);
            res.status(500).json({error: e});
    }
});


module.exports = router;