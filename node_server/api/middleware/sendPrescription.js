const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');

module.exports.sendPrescription = async(toEmail, name, medicines, symptoms, diagnosis, advice, doctorname, doctorEmail, phno) => {
    const pdf = new PDFDocument();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jayvishaalj.01@gmail.com',
          pass: 'jayvishaal144'
        }
    });
    
    let buffers = [];
    pdf.on('data', buffers.push.bind(buffers));
    pdf.text('Hello , '+name+"\n"+medicines+"\n"+symptoms+"\n"+diagnosis+"\n"+advice+"\n"+doctorname+"\n"+doctorEmail+"\n"+phno, 100, 100);
    pdf.end();
    pdf.on('end', async () => {

        let pdfData = Buffer.concat(buffers);

        let mailOptions = {
            from: 'jayvishaalj.01@gmail.com',
            to: toEmail,
            subject: 'Prescription',
            text: 'Prescription for the Doctor Visit ',
            attachments: [{
                filename: 'attachment.pdf',
                content: pdfData
            }]
        };
    
        return await transporter.sendMail(mailOptions);

        });

    
    
}  