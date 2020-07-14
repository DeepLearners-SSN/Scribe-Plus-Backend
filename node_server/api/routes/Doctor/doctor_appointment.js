const express = require('express');
const router = express();
const mongoose = require('mongoose');
const { appointmentSchema,appointmentSchemaCheck }  = require('./doctor_schema');
const { auth } = require('../../middleware/auth');


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
 *                      type: date
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
                visited : false
            });
            appointment.save().then((result)=>{
                console.log("RESULT "+result);
                res.status(200).json({
                    message: "sucessfully added!",
                });
            }).catch((err)=>{
                console.log("ERROR "+err);
                res.status(500).json({
                    message : err
                });
            });
        });
    } catch (error) {
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
 *                      $ref: "#/definitions/Prescription"
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
 * 
 *           
 */
router.post('/get', auth, (req,res,next) => {
    try {
        if(req.body.doctorAddress) { 
            appointmentSchema.find({ doctorAddress: req.body.doctorAddress },(err,appointment) => {
                if(err){
                    res.status(400).json({ error:err });
                }
                else
                {
                    res.status(200).json(appointment);
                }
            });
        }
        else{
            return res.status(400).json({ error:"specify the doctor address" });
        }
    } catch (error) {
        res.status(500).json({
            message : error
        });
    }
});



module.exports = router;