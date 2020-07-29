const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const path = require('path');
var cors = require('cors')
const app = express();
// REQUIRED FOR SENDING FILES STORED ON SERVER BUT NOT FOR BASE64 STRINGS
const fs = require('fs');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


console.log(process.cwd());
console.log(path.dirname(__filename));

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "YOUR_CREDENTIALS_FROM_MAILTRAP",
    pass: "YOUR_CREDENTIALS_FROM_MAILTRAP"
  }
});

// EXAMPLE OF SENDING A FILE STORED IN THE server FOLDER
var mailOptions = {
  // YOU CAN USE ANY EMAIL YOU WANT FOR FROM AND TO
  // WHEN THE EMAIL SENDS IT'LL SHOW UP IN MAILTRAP IN A FEW SECONDS
  from: '"Rupa" <rupinder.dhillon@flatironschool.com>',
  to: '"Rupa" <rupinder.dhillon@flatironschool.com>',
  subject: 'Nice Nodemailer test',
  text: 'Hey there, it’s our first message sent with Nodemailer ;) ',
  html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer',
  attachments: [
    {   
        filename: 'hi_there.pdf',
        content: fs.createReadStream(path.dirname(__filename) + '/hi_there.pdf'),
        contentType: 'application/pdf'
    }
  ]
};

// EXAMPLE SENDING BASE64 STRING AS A PDF
// TO REDUCE THE AMOUNT OF DATA STORED ON THE SERVER AND ALLOW JSON REQUESTS
// I CONVERTED THE PDF TO A BASE64 STRING ON THE FRONTEND AND SENT THAT
// THAT ALLOWED ME TO ADD A REALLY SIMPLE ATTACHMENT
function makeMailOptions(reqBody) {
  return {
    from: '"Rupa" <rupinder.dhillon@flatironschool.com>',
    to: '"Rupa" <rupinder.dhillon@flatironschool.com>',
    subject: 'Nice Nodemailer test',
    text: 'Hey there, it’s our first message sent with Nodemailer ;) ',
    html: `<b>Hey there ${reqBody.name}! </b><br> This is our first message sent with Nodemailer`,
    attachments: [
      {   
        filename: `hello.pdf`,
        content: reqBody.file,
        encoding: 'base64',
      }
    ]
  };
}

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    greeting: `Hello ${name}!`
  }));
});

app.post('/api/mail', (req, res) => {
  // console.log(makeMailOptions(req.body))
  transport.sendMail(makeMailOptions(req.body), (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });

});

app.listen(process.env.PORT || 8080, () =>
  console.log('Express server is running on localhost:3001'));