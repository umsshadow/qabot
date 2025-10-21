import nodemailer from 'nodemailer';

async function sendFileMail(req, res) {
  try {
    const { to, subject, text } = req.body;
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log("Body to send ",req.body)
    console.log("Files to send ",req.files)

    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path
    })) : [];
    console.log(attachments)

    // Send mail with attachments
    const info = await transporter.sendMail({
      from: `"Qavah Support" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      attachments: attachments
    });

    console.log('Email with attachments sent:');
    return res.status(200).json({ message: 'Email with attachments sent successfully' });
  } catch (error) {
    console.error('Error sending email with attachments:', error);
    return res.status(500).json({ message: 'Failed to send email with attachments' });
  }
}


async function sendSICMail(req, res) {
    try {
console.log("Sending email to ", req.body.to)        
const transporter = nodemailer.createTransport({
            host: process.env.SIC_EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
              user: process.env.SIC_EMAIL_USER,
              pass: process.env.SIC_EMAIL_PASS
            }
          });
      
    
        const mailOptions = {
            from: `SIC Support <${process.env.SIC_EMAIL_USER}>`,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.message
        }
        
       const response= await transporter.sendMail(mailOptions)
    console.log("RESPONS ",response)
        res.status(200).json({ message: 'Email sent successfully' }) 
    } catch (error) {
	console.log(error)
        res.status(500).json({ message: 'Email not sent' })
    }
}
 



async function sendContratMail(req, res) {
  try {
    const { to, subject, text } = req.body;
    console.log("BODY /mail/contrat ",req.body)
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const attachments =[
      {
        filename: req.body.contrat.name,
        path: `/home/rocky/apis/${req.body.contrat.path}`
      },
      {
        filename: req.body.planEchelonnement.name,
        path: `/home/rocky/apis/${req.body.planEchelonnement.path}`
      }
    ]
console.log("ATTACHEMENT ",attachments)
    // Send mail with attachments
    const info = await transporter.sendMail({
      from: `"Qavah Support" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      attachments: attachments,

    });

    console.log('Email with attachments sent:', info.messageId);
    return res.status(200).json({ message: 'Email with attachments sent successfully' });
  } catch (error) {
    console.error('Error sending email with attachments:', error);
    return res.status(500).json({ message: 'Failed to send email with attachments' });
  }
}









async function sendMail(to, subject, text) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}


// Example usage of sendFileMail
/*
const attachments = [
  {
    filename: 'document.pdf',
    path: '/path/to/document.pdf'
  },
  {
    filename: 'image.jpg', 
    path: '/path/to/image.jpg'
  }
];

sendFileMail(
  'recipient@example.com',
  'Document and Image Attached',
  'Please find the attached documents.',
  attachments
).then(success => {
  if (success) {
    console.log('Email with attachments sent successfully');
  } else {
    console.log('Failed to send email with attachments');
  }
});
*/
 
export { sendFileMail, sendMail, sendContratMail, sendSICMail };