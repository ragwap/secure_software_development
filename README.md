# secure_software_development
This project will depict the use of OAuth feature in web development

# Content
This project consists of two foldders namely: 
backend(folder that contains node js implementation for backend) 
and 
ssd(the folder responsible for the frontend)

# Pre-requisites
Make sure that npm and node js are downloaded and installed.
If not, download and install from the following link: https://www.npmjs.com/get-npm

# Configuration
1. Open the two folders in seperate VS Code windows
2. Run `npm install` on both folders seperately using the terminal of the editors opened. This will download and install all the necessar npm packages required.
3. Once the required packages and modules are installed, run `npm start` on both folders seperately as you ran `npm install`.
4. Now the backend should be hosted in port 5000 and the frontend should be hosted in port 3000

Navigate to below mentioned URLs and see. The backend end and the client should be hosted in the respective URLs.

Backend: http://localhost:5000
Client: http://localhost:3000

# Functional flow
1. Navigate to the client URL once the configuration is done
2. Click on the login button displayed at the top of the page.
3. You will be redirected to choose a google account that you would like to upload files into. Select your prefferred account and login to it enabling and providing necessary access.
4. Then you will be redirected back to the web application hosted as your client as a logged in user. (This is because you have no received an OAuth token to access the google drive from this web application without revealing your google account credentials to the web application)
5. Click on `Choose File` button at the bottom of the page and choose a file to upload from your PC.
6. Once uploaded to google drive, you will be prompted with a popup saying that the files were successfully uploaded.

Note: If the token has expired, you will be logged out automatically and will be required to login and continue from step 3. 
