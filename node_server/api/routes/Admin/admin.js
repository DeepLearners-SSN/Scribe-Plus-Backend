const express = require('express');
const router = express();
const { adminLoginSchema } = require('./schema');
const jwt = require('jsonwebtoken');


/**
 * @swagger
 * /api/admin/login:
 *   post:
 *      tags:
 *          - admin
 *      description: Admin Login Api this returns a jwt token in header
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: admin
 *         schema :
 *              type: object
 *              required:
 *                  - name
 *                  - password
 *              properties:
 *                  name:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *             description: Admin logged in successfully
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 * 
 *          401:
 *             description: wrong Creds check the name and password
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 */
router.post('/login',(req,res,next) => {
    try{
        const { error } = adminLoginSchema.validate(req.body);
        if(error) { 
            return res.status(400).json({ error: error.details[0].message }); 
        }
        if(req.body.name === "admin" && req.body.password === "password"){
            const token = jwt.sign({ _name: req.body.name, _user: "admin" }, "jayvishaalj");
            return res.header('auth-token', token).status(200).json({ message: "Logged In!" });
        }
        else{
            return res.status(400).json({message:"Wrong Creds"});
        }
        
    }
    catch(e){
        return res.status(400).json({message:"Wrong Creds"});
    }
});

module.exports = router;