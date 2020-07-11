
const express = require('express');
const router = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createDoctor, getDoctor, getDocCount } = require('../Blockchain/connection/handlers.js');

/**
 * @swagger
 * /api/doctor/create:
 *   post:
 *      tags:
 *          - doctor
 *      description: to create a new doctor 
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: doctor
 *         schema :
 *              type: object
 *              required:
 *                  - name
 *                  - phno
 *                  - email
 *                  - password
 *              properties:
 *                  name:
 *                      type: string
 *                  phno:
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
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
router.post('/create',async (req,res,next) => {
    try{
        console.log("CREATE DOCTOR API CALLED",req.body);
        const password= await bcrypt.hash(req.body.password,10);
        console.log("PASSWORD ",password);
        createDoctor(req.body.name,req.body.phno,req.body.email,password).then(account => {
            console.log("ACCOUNT : ",account);
            res.status(200).json({message:"doctor added!",result:account});
        });
    }
    catch(e){
        res.status(400).json({message:"wrong details"});
    }
    
    
});

/**
 * @swagger
 * /api/doctor/details:
 *   post:
 *      tags:
 *          - doctor
 *      description: to get the details of a doctor
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: doctor
 *         schema :
 *              type: object
 *              required:
 *                  - address
 *              properties:
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
router.post('/details',async (req,res,next) => {
    console.log("DOC DETAIL : ",req.body.address);
    try{   
        const doctor = await getDoctor(req.body.address);
    res.status(200).json({doctor:{"name":doctor["1"],"phno":doctor["2"],"doctorId":doctor["0"],"email":doctor["3"]}});
    }
    catch(e){
        res.status(400).json({message:"Wrong Address"});
    }
    
});


/**
 * @swagger
 * /api/doctor/login:
 *   post:
 *      tags:
 *          - doctor
 *      description: to get the details of a doctor
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: doctor
 *         schema :
 *              type: object
 *              required:
 *                  - address
 *                  - password
 *              properties:
 *                  address:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *             description: A doctor exist and the details of the doctor are returned 
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 * 
 *          401:
 *             description: wrong Creds check the address and password
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 */
router.post('/login',async (req,res,next) => {
    try{
        console.log("LOGIN DOC : ",req.body);
    const doctor = await getDoctor(req.body.address);
    const validPass = await bcrypt.compare(req.body.password,doctor["4"]);
    if(validPass){
        const token = jwt.sign({_name : req.body.address,_user:"doctor"},"jayvishaalj");
        return res.header('auth-token',token).status(200).json({message:"Logged In!"});
    }
    else{
        return res.status(401).json({message:"Unotherized! wrong password"});
    }
    }
    catch(e){
        res.status(400).json({message:"Wrong Creds"});
    }
    
    
});

/**
 * @swagger
 * /api/doctor/count:
 *   get:
 *      tags:
 *          - doctor
 *      description: Returns the count of doctors registered in the blockchain
 *      parameters:
 *       - name: auth-token
 *         description: auth token got from  login.
 *         in: header
 *         type: string
 *      responses:
 *          200:
 *             description: A json containing a message
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *          401:
 *              description: Access Denied
 */
router.get('/count',async (req,res,next) => {
    const message = await getDocCount();
    res.status(200).json({message:message});

});

module.exports = router;