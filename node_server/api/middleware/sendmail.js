const nodemailer = require("nodemailer");

module.exports.sendMail = async(toName,mailMessageText,toEmail,QrCode) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jayvishaalj.01@gmail.com',
          pass: 'jayvishaal144'
        }
    });
    
    let mailOptions = {
        from: 'jayvishaalj.01@gmail.com',
        to: toEmail,
        subject: toName+'QR CODE',
        text: mailMessageText+'This is unique QR Code do not share this with anyone! ',  
        attachments: [
            {   
            // encoded string as an attachment
              filename: 'Qr.jpg',
              content: QrCode.split("base64,")[1],
              encoding: 'base64'
            }
          ]
    };
    
    return await transporter.sendMail(mailOptions);
}  