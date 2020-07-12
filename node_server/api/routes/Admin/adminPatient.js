const express = require('express');
const router = express();
const { getPatientForAdmin } = require("../Blockchain/connection/handlers.js");


/**
 * @swagger
 * /api/admin/patient/details:
 *   post:
 *      tags:
 *          - admin
 *      description: to get the details of a patient
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
 *                  - patientQrCode
 *              properties:
 *                  patientQrCode:
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
    try{
        console.log("GET PAT : ",req.body);
    getPatientForAdmin(req.body.patientQrCode,req.body.address).then((patient) => {
        console.log("PAT : ",patient);
        res.status(200).json({patient:patient});
    });
    }
    catch(e){
        res.status(400).json({message:"Bad Request"});
    }
    
});


module.exports = router;