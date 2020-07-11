const express = require('express');
const router = express();
const { getDocCount,getDoctor,getAccounts } = require("../Blockchain/connection/handlers.js");


/**
 * @swagger
 * /api/admin/doctor/list:
 *   get:
 *      tags:
 *          - admin
 *      description: to get the list  of all doctors
 *      consumes:
 *       - application/json
 *      responses:
 *          200:
 *             description: A doctor exist and the details of the doctor are returned 
 *             schema:
 *                  type: array
 *                  items:
 *                      $ref: "#/definitions/Doctor"
 * definitions:
 *          Doctor:
 *            type: object
 *            properties:
 *              name:
 *                  type: string
 *              phno:
 *                  type: string
 *              patientId:
 *                  type: string
 *              email:
 *                  type: string  
 */
router.get('/list',async (req,res,next)=> {
    let doctorList = [];
    getDocCount().then(async (count) => {
        console.log("DOC COUNT : ",count);
        if(count == 0){
           return res.status(200).json({});
        }
        else{
            const accounts = await getAccounts();
            for(let i=1;i<=count;i++){
                console.log(accounts[i]);
                await getDoctor(accounts[i]).then((doctor) => {
                    doctorList.push(doctor);
                });
            }
            console.log("DOCTORS : ",doctorList);
            return res.status(200).send(doctorList);
        }
    });
    
});


module.exports = router;