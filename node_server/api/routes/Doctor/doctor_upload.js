const express = require('express');
const router = express();
const multer = require("multer");
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
// const ID = 'AKIA4BGGYS5LC5IFN4PK';
// const SECRET = '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';
const ID = 'AKIA4BGGYS5LJXQVN53J';
const SECRET = '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';
const BUCKET_NAME = 'scribe-plus1';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
AWS.config.loadFromPath("/usr/src/app/api/routes/Doctor/aws_key.json");
var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      key: function (req, file, cb) {
          console.log(file);
          cb(null, ''+Date.now()+'.mp3'); //use Date.now() for unique file keys
      }
  })
});
/**
 * @swagger
 * /api/doctor/upload/audio:
 *   post:
 *      tags:
 *          - doctor
 *      description: to upload the recording of the doctor and patient
 *      consumes:
 *          - multipart/formData
 *      parameters:
 *       - name: file
 *         description: audio to be uploaded
 *         in: formData
 *         type: file
 *         required: true
 *      responses:
 *          200:
 *             description: A json containing a message
 *             schema:
 *                  type: object
 *                  properties:
 *                          message:
 *                              type: string
 *                          socketId:
 *                              type: string
 *          
 */
router.post("/audio",upload.single("file"),async (req,res,next) => {
  console.log("BODY",req.file);
  const transcriber = new AWS.TranscribeService({ region: "us-west-2" });
  const params = {
    LanguageCode: "en-IN",
    Media: {
      MediaFileUri:
        req.file.location,
    },
    TranscriptionJobName: req.file.key.slice(0,-4),
    Settings: {
      MaxSpeakerLabels: "5",
      ShowSpeakerLabels: true,
    },
    OutputBucketName: "scribe-json1",
  };
  const data = await transcriber.startTranscriptionJob(params).promise();
  console.log(data);
  res.status(200).json({message:"success",socketId:req.file.key.slice(0,-4),transcriber:data});
});


/**
 * @swagger
 *
 * /api/doctor/upload/check/{name}:
 *   get:
 *     tags:
 *       - doctor
 *     description: user api to display the user in response
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: The name of the job you want to check the status.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 *         schema:
*              type: object
*              properties:
 *                TranscriptionJob:
 *                    type: object
 *                    properties:
 *                        TranscriptionJobName:
 *                           type: string
 *                        TranscriptionJobStatus:
 *                           type: string
 *                        LanguageCode:
 *                           type: string 
 *                        MediaSampleRateHertz:
 *                           type: number  
 *                        MediaFormat:
 *                           type: string
 *                        Media:
 *                           type: object
 *                           properties:
 *                              MediaFileUri:
 *                                type: string
 *                        Transcript:
 *                           type: object
 *                           properties:
 *                              TranscriptFileUri:
 *                                type: string
 *                        StartTime:
 *                           type: Date  
 *                        CreationTime:
 *                           type: Date  
 *                        CompletionTime:
 *                           type: Date  
 *                        Settings:
 *                           type: object
 *                           properties:
 *                              ShowSpeakerLabels:
 *                                type: boolean
 *                              MaxSpeakerLabels:
 *                                type: number  
 *                              ChannelIdentification:
 *                                type: boolean  
 *                              ShowAlternatives:
 *                                type: boolean  
 * 
 *         
 */

router.get("/check/:name",async (req,res,next) => {
  const transcriber = new AWS.TranscribeService({ region: "us-west-2" });
  const params = {
    TranscriptionJobName: req.params.name,
  };
  const stats = await transcriber.getTranscriptionJob(params).promise();
  console.log(stats);
  res.status(200).json(stats);
});

module.exports = router;