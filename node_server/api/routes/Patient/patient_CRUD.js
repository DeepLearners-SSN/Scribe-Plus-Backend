const express = require('express');
const router = express();
const { createPatient,getPatient,patientCount } = require("../Blockchain/connection/handlers.js");


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
    createPatient(req.body.name,req.body.phno,req.body.email).then((account) => {
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
 *                  - phone
 *                  - address
 *              properties:
 *                  phone:
 *                      type: string
 *                  address:
 *                      type: string
 *      responses:
 *          200:
 *             description: A doctor exist and the details of the doctor are returned 
 *             schema:
 *                  type: object
 *                  properties:
 *                          doctor:
 *                              type: object
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                  phno:
 *                                      type: string
 *                                  doctorId:
 *                                      type: string
 *                                  email:
 *                                      type: string          
 */
router.post('/details',(req,res,next)=> {
    console.log("GET PAT : ",req.body);
    getPatient(req.body.phone,req.body.address).then((patient) => {
        console.log("PAT : ",patient);
        res.status(200).json({patient:patient});
    })
});
module.exports = router;