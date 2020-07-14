const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const jwt = require('jsonwebtoken');
const {  deploy } = require('./api/routes/Blockchain/connection/deploy.js');
const { auth } = require('./api/middleware/auth.js');
const router = require('./api/routes/router.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');




// const ioserver = require('http').createServer();

// const io = require('socket.io')(ioserver);

// io.on('connect',socket => {
//     console.log('connected : ',socket);
//     socket.emit('welcome',"welcome to the server");
//     socket.on('completedjson',(dataRes) =>{
//         console.log("got completed json",dataRes);
//         io.emit('completedjson',dataRes);
//     });
// });

// ioserver.listen(3001,()=>{console.log("CONNECTION PORT 3001")});
  

// const conn = mongoose.createConnection("mongodb://db:27017/scribeplus", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// let gfs;
mongoose.connect('mongodb://db:27017/scribeplus',
{
        useNewUrlParser: true,
        useUnifiedTopology: true
});


const app = express();
const PORT = process.env.PORT ||3000 ;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers","auth-token")
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const swaggerOptions = {
    swaggerDefinition : {
        info:{
            version:"v1",
            title:'Scribe Plus API DOC',
            description:'This is a sih project',
            contact:{
                name:"Jay Vishaal J"
            },
        },
    },
    apis:["./api/**/*.js"]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerDocs,{explorer:false,customSiteTitle:"Scribe + Api",customCss:'.swagger-ui .topbar {display:none}'}));
app.use(router);
/**
 * @swagger
 *
 * /api/{username}:
 *   get:
 *     tags:
 *       - api
 *     description: user api to display the user in response
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                  user:
 *                      type: string
 *              
 */

app.get('/api/:username',(req,res,next)=>{
    const token = jwt.sign({_name : req.params.username},"jayvishaalj");
    res.header('auth-token',token).status(200).json({message:"API BASE URL",user:req.params.username});
});



/**
 * @swagger
 * /api:
 *   get:
 *      tags:
 *          - api
 *      description: Returns the base api url
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
app.get('/api',auth,(req,res,next)=>{
    res.status(200).json({message:"Base URL"});
});

/**
 * @swagger
 * /auth:
 *   get:
 *      tags:
 *          - base
 *      description: Returns the base  url
 *      responses:
 *          200:
 *             description: A json containing a message
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 */




var server = app.listen(PORT,'0.0.0.0',async ()=> {
    const address = await deploy();
    console.log("ADDRESS : ",address);
    console.log(`SERVER  ON ${PORT}`);
    var host = server.address().address;
    console.log('HOST : ',host);
    // conn.once("open", () => {
    //     // init stream
    //     console.log("CONNECTION OPEN");
    //     gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    //       bucketName: "uploads"
    //     });
    //   });
      
});