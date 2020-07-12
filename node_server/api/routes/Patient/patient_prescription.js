const express = require('express');
const router = express();
const { createPrescription,getPrescription } = require("../Blockchain/connection/handlers.js");
const { prescriptionSchema,getPrescrtiptionSchema } = require('./patient_schema');
const { auth } = require('../../middleware/auth.js');


/**
 * @swagger
 * /api/patient/prescription/create:
 *   post:
 *      tags:
 *          - patient
 *      description: to create a new prescription of the doctor
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
 *             $ref: "#/definitions/Prescription"
 *      responses:
 *          200:
 *             description: A doctor exist and the details of the doctor are returned 
 *             schema:
 *                  type: object
 *                  properties:
 *                          hash:
 *                              type: string                        
 * 
 * 
 * 
 *           
 */
router.post('/create',auth,async (req,res,next) => {
    try{
        const { error } = prescriptionSchema.validate(req.body);
        if(error) { 
            return res.status(400).json({ error:error.details[0].message });
        }
        console.log("PRESCEIPTOIN API");
        return await createPrescription(req.body.medicines, req.body.symptoms, req.body.diagnosis, req.body.advice, req.body.patientQrCode, req.body.doctorAddress).then((result) => {
            console.log("RESULT : ",result);
            res.status(200).json(result);
        });
    }
    catch(e){
        res.status(400).json({error:e});
    }
});



/**
 * @swagger
 * /api/patient/prescription/get:
 *   post:
 *      tags:
 *          - patient
 *      description: to get a single prescription of a patient
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
 *              type: object
 *              required:
 *                  - prescriptionId
 *                  - patientQrCode
 *                  - doctorAddress
 *              properties:
 *                  prescriptionId:
 *                      type: string
 *                  patientQrCode:
 *                      type: string
 *                  doctorAddress:
 *                      type: string
 *      responses:
 *          200:
 *             description: Prescription details
 *             schema:
 *                 $ref: "#/definitions/Prescription" 
 * 
 * 
 *           
 */
router.post('/get',auth,async(req,res,next) => {
    try{
        const { error } = getPrescrtiptionSchema.validate(req.body);
        if(error) { 
            return res.status(400).json({ error:error.details[0].message });
        }
        console.log("GET PRESCRIPTION !");
        return await getPrescription(req.body.prescriptionId, req.body.patientQrCode, req.body.doctorAddress).then((prescription) => {
            console.log("PRESCRIPTION : ",prescription);
            return res.status(200).json(prescription);
        });
        
    }
    catch(e){
        res.status(400).json({ error:e });
    }
});

module.exports = router;