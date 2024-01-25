const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const streamifier = require('streamifier');
const cors = require('cors');
const app = express();
const port = 3001;
const nodemailer = require('nodemailer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const dotenv = require('dotenv');
dotenv.config();

const filesArray = []
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transport = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
  }
})

async function sendEmailWithPDF(name, email, governmentId, debtAmount, debtDueDate, debtId) {
  const doc = new PDFDocument();
  const pdfFilePath = `boleto_${governmentId}.pdf`;

  doc.text(`Name: ${name}`);
  doc.text(`Government ID: ${governmentId}`);
  doc.text(`Email: ${email}`);
  doc.text(`Debt Amount: ${debtAmount}`);
  doc.text(`Debt Due Date: ${debtDueDate}`);
  doc.text(`Debt ID: ${debtId}`);

  doc.pipe(fs.createWriteStream(pdfFilePath));
  doc.end();  

  await transport.sendMail({
    from: `Júlio Felipe da Silva <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Seu boleto para a Kanastra',
    text: `Olá, ${name}. Em anexo neste e-mail se encontra o boleto com o código de pagamento para seu débito!`,
    attachments: [{ path: pdfFilePath }],
  });

  fs.unlinkSync(pdfFilePath);
}

app.use(cors());
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const csvData = [];
  const stream = streamifier.createReadStream(file.buffer);

  stream
    .pipe(csvParser())
    .on('data', (row) => {

      csvData.push(row);
    })
    .on('end', () => {
      console.log('Parsed CSV data:', csvData);

      filesArray.push(file)
      const responseData = {
        message: 'File received and processed successfully.',
        file: filesArray,
      };
      console.log(responseData);
      res.status(200).json(responseData);

      try {
        csvData.forEach(async (debtDetail) => {
        const { name, email, governmentId, debtAmount, debtDueDate, debtId } = debtDetail;
        await sendEmailWithPDF(name, email, governmentId, debtAmount, debtDueDate, debtId);
      });
      console.log('Emails sent successfully!')

      } catch (error) {
        console.error('Error sending emails:', error);
      }
      

    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
