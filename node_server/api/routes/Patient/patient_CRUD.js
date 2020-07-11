const express = require('express');
const router = express();
const { createPatient,getPatient,patientCount } = require("../Blockchain/connection/handlers.js");
const { sendOTP } = require("../../middleware/sendMessage.js");

//helper  Function
function makeQrCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function makeOTP(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }



/**
 * @swagger
 * /api/patient/count:
 *   get:
 *      tags:
 *          - patient
 *      description: Returns the count of patient registered in the blockchain
 *      responses:
 *          200:
 *             description: A json containing a message
 *             schema:
 *                  type: object
 *                  properties:
 *                          count:
 *                              type: string
 */
router.get('/count',async(req,res,next) => {
    const count = await patientCount();
    res.status(200).json({count:count});
});

/**
 * @swagger
 * /api/patient/create:
 *   post:
 *      tags:
 *          - patient
 *      description: to create a new patient 
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: patient
 *         schema :
 *              type: object
 *              required:
 *                  - name
 *                  - phno
 *                  - email
 *              properties:
 *                  name:
 *                      type: string
 *                  phno:
 *                      type: string
 *                  email:
 *                      type: string
 *      responses:
 *          200:
 *             description: A json containing a the details of the address of the doctor
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                          result:
 *                              type: object
 *                              properties:
 *                                  account:
 *                                      type: string
 *                                  hash:
 *                                      type: string
 *          
 */
router.post('/create',(req,res,next) => {
    console.log("CREATE PATIENT API CALLED",req.body);
    const patientQrCode = makeQrCode(16);
    console.log(patientQrCode);
    createPatient(req.body.name, req.body.phno, req.body.email, patientQrCode).then((account) => {
        console.log("ACCOUNT PAT : ", account);
        res.status(200).json({message:"patient added!",result:account});
    });
});


/**
 * @swagger
 * /api/patient/details:
 *   post:
 *      tags:
 *          - patient
 *      description: to get the details of a patient
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: doctor
 *         schema :
 *              type: object
 *              required:
 *                  - patientQrCode
 *                  - address
 *              properties:
 *                  patientQrCode:
 *                      type: string
 *                  address:
 *                      type: string
 *      responses:
 *          200:
 *             description: A doctor exist and the details of the doctor are returned 
 *             schema:
 *                  type: object
 *                  properties:
 *                          patient:
 *                              type: object
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                  phno:
 *                                      type: string
 *                                  patientId:
 *                                      type: string
 *                                  email:
 *                                      type: string          
 */
router.post('/details',(req,res,next)=> {
    console.log("GET PAT : ",req.body);
    getPatient(req.body.patientQrCode,req.body.address).then((patient) => {
        console.log("PAT : ",patient);
        if(patient[1] === "null"){
            res.status(404).json({patient:"not found"});
        }
        else if(patient[1] === "newDoctor"){
            const OTP = makeOTP(6);
            console.log("OTP FOR PAT : ",req.body.patientQrCode," is : ", OTP,"SEND TO : ",patient[3]);
            sendOTP(patient[3],OTP).then(() => {
                res.status(401).json({OTP:OTP});
            });
        }
        else{
            res.status(200).json({patient:patient});
        }
    })
});


module.exports = router;