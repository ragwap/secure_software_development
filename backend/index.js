const express = require('express');
const auth_app = express();
const { google } = require('googleapis');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const secret = require('./client_secret_461156002118-s7j5f4c2c16hbu40smpof3usr6imr21m.apps.googleusercontent.com.json');
const { file } = require('googleapis/build/src/apis/file');

// Get client credentials and assigned to variables
const clientID = secret.web.client_id;
const clientSecret = secret.web.client_secret;
const redirectUris = secret.web.redirect_uris;
const auth = new google.auth.OAuth2(clientID, clientSecret, redirectUris[0]);

const authScope = ['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file'];

auth_app.use(cors());
auth_app.use(bodyParser.urlencoded({ extended: false }));
auth_app.use(bodyParser.json());

auth_app.get('/root', (req, res) => res.send('API Running'));

auth_app.get('/', (req, res) => {
    const url = auth.generateAuthUrl({
        access_type: 'offline',
        scope: authScope,
    });
    return res.send(url);
});

auth_app.get('/getToken', (req, res) => {
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

// auth_app.post('/getUserProfile', (req, res) => {
//     if (req.body.token == null) {
//         return res.status(400).send('Token not available');
//     }
//     auth.setCredentials(req.body.token);
//     const oAuth2 = google.oauth2({
//         version: 'v2',
//         auth: auth,
//     });

//     oAuth2.userinfo.get((error, response) => {
//         if (error) {
//             return res.status(400).send(error);
//         }
//         res.send(response.data);
//     })
// });

auth_app.post('/uploadToDrive', (req, res) => {
    var incomingForm = new formidable.incomingForm();
    incomingForm.parse(req, (error, fields, files) => {
        if (error) {
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
                    res.status(400).send(error);
                }
                else {
                    res.send('Successfully uploaded file');
                }
            }
        )
    })
});

const PORT = process.env.PORT || 5000;
auth_app.listen(PORT, () => console.log(`Server Up in ${PORT}`));