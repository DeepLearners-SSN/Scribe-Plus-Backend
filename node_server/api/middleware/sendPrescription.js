const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const AWS = require('aws-sdk');
var unirest = require("unirest");
const req = unirest("POST", "https://www.fast2sms.com/dev/bulk");
const logger = require('../../config/logger')(module);


const ID = 'AKIA4BGGYS5LJXQVN53J';
const SECRET = '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';
const BUCKET_NAME = 'scribe-plus-prescriptions';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    signatureVersion: 'v4'
});

module.exports.sendPrescription = async(toEmail, name, medicines, symptoms, diagnosis, advice, doctorname, doctorEmail, phno, prescriptionName, patientQrCode, patPhone) => {
    const password = patPhone.slice(0,-5);
    const pdf = new PDFDocument({userPassword:password});

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'scribeplus.contact@gmail.com',
          pass: 'deeplearners'
        }
    });
    
    let buffers = [];
    pdf.on('data', buffers.push.bind(buffers));
    pdf.text('Hello , '+name+"\n"+medicines+"\n"+symptoms+"\n"+diagnosis+"\n"+advice+"\n"+doctorname+"\n"+doctorEmail+"\n"+phno, 100, 100);
    pdf.end();
    pdf.on('end', async () => {

        let pdfData = Buffer.concat(buffers);

        let mailOptions = {
            from: 'scribeplus.contact@gmail.com',
            to: toEmail,
            subject: 'Prescription',
            text: 'Prescription for the Doctor Visit ',
            attachments: [{
                filename: 'attachment.pdf',
                content: pdfData
            }]
        };
        const params = {
            Bucket: BUCKET_NAME,
            Key: patientQrCode+prescriptionName+'.pdf', // File name you want to save as in S3
            Body: pdfData
        };
        
        await s3.upload(params, async function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            const url = await s3.getSignedUrl('getObject', {
                Bucket: BUCKET_NAME,
                Key: patientQrCode+prescriptionName+'.pdf', // File name you want to save as in S3
                Expires: 60 * 5
            });
            console.log("object Signed Url : ",url);
            var messageString = "Your Prescription is available in the following link for the next 5mins so download and keep it safe " + url;
            console.log(messageString);
            req.headers({
                "authorization": "aefkJGosAbt4CzKpjhYvM1rmUgyqWZHwl5ud9XF3T6OSDnBRLP3TnLhQiEDNBIvRVAsUFok8MJe0qCO5"
            });

            req.form({
                "sender_id": "FSTSMS",
                "message": messageString,
                "language": "english",
                "route": "p",
                "numbers": patPhone,
            });

            req.end(async function (res) {
                if (res.error) {
                    logger.log('error',`An error occured at sending message ${res.error}`);
                    throw new Error(res.error);
                }        
            });
            return await transporter.sendMail(mailOptions);
        }); 
        

        });

    
    
}  