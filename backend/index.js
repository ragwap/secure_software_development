// Gather the using dependencies
const express = require('express');
const auth_app = express();
const { google } = require('googleapis');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const secret = require('./client_secret.json');

// Get client credentials and assign to variables
const clientID = secret.web.client_id;
const clientSecret = secret.web.client_secret;
const redirectUris = secret.web.redirect_uris;
const auth = new google.auth.OAuth2(clientID, clientSecret, redirectUris[0]);

const authScope = ['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file'];

auth_app.use(cors());
auth_app.use(bodyParser.urlencoded({ extended: false }));
auth_app.use(bodyParser.json());

// Response of this get method will contain the URL to login to an account
auth_app.get('/authUrl', (req, res) => {
    const url = auth.generateAuthUrl({
        access_type: 'offline',
        scope: authScope,
    });
    return res.send(url);
});

// Once logged into the account and access is enabled with the help of the above get method, a token will be rendered in return by this post
auth_app.post('/getToken', (req, res) => {
    if (req.body.code == null) {
        return res.status(400).send('Code not available');
    }
    auth.getToken(req.body.code, (error, token) => {
        if (error) {
            console.error(error);
            return res.status(400).send('Error receiveing access Token');
        }
        res.send(token);
    });
});

// This post will upload a file to google drive by using the token rendered from the above post
auth_app.post('/uploadToDrive', (req, res) => {
    var incomingForm = new formidable.IncomingForm();
    incomingForm.parse(req, (error, fields, files) => {
        if (error) {
            console.log(error);
            return res.status(400).send(error);
        }
        const token = JSON.parse(fields.token);
        if (token == null) {
            return res.status(400).send('Null Token');
        }
        auth.setCredentials(token);
        const drive = google.drive({
            version: 'v3',
            auth: auth
        });
        const resouce = {
            name: files.file.name,
        }
        const media = {
            mimeType: files.file.type,
            body: fs.createReadStream(files.file.path),
        }
        drive.files.create(
            {
                resouce: resouce,
                media: media,
                fields: 'id',
            },
            (error, file) => {
                auth.setCredentials(null);
                if (error) {
                    console.log(error);
                    res.send('Token Expired')
                }
                else {
                    res.send('Successfully uploaded file');
                }
            }
        )
    })
});

// Listening to the server 
const PORT = process.env.PORT || 5000;
auth_app.listen(PORT, () => console.log(`Server Up in ${PORT}`));