import React, { useState, useEffect } from 'react';
import logo from './drive.png';
import './App.css';
import axios from 'axios';

function Login() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  var params = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (params.get('code') != null) {
      // Once logged into the account and access is enabled, a token will be rendered in return by this post
      axios.post('http://localhost:5000/getToken', { 'code': params.get('code') }).then(response => {
        localStorage.setItem('authToken', JSON.stringify(response.data));
        setAuthToken(JSON.stringify(response.data))
      })
    }
  }, [authToken == '']) //useEffect works only if the condition within box brackets are correct

  function onLogin() {
    // Response of this get method will contain the URL that enables the user to login to a google drive account
    axios.get('http://localhost:5000/authUrl').then(
      response => {
        console.log(response);
        window.location.replace(response.data);
      }
    ).catch(error => {
      console.log(error);
    })
  }

  if (authToken == "")
    return (<div className="Login">
      <header className="App-header">
        <button className="login" onClick={onLogin}>Login</button>
        <h1>Upload to Google Drive</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>);
  else return (<Home token={authToken} />);
}

function Home({ token }) {

  function onLogout() {
    localStorage.setItem('authToken', '');
    window.location.reload(true);
  }

  function onUpload(obj) {
    console.log(obj.target.files[0]);
    let formData = new FormData()

    formData.append('file', obj.target.files[0]);
    formData.append('token', token);

    // Post request to upload a file into the logged in drive
    axios.post('http://localhost:5000/uploadToDrive', formData, {
      headers: {
        'Content-Type': 'paltipart/form-data'
      },
    }).then(
      response => {
        localStorage.setItem('uploadFeedback', response.data);
        if (localStorage.getItem('uploadFeedback') == 'Successfully uploaded file') {
          window.alert(localStorage.getItem('uploadFeedback'));
          localStorage.setItem('uploadFeedback', '');
          window.location.reload(true);
        }
        else if (localStorage.getItem('uploadFeedback') == 'Token Expired') {
          window.alert('Token Expired! Logging out');
          localStorage.setItem('uploadFeedback', '');
          onLogout();
        }
      }
    );
  }

  return (
    <div className="Home">
      <header className="App-header">
        <button className="logout" onClick={onLogout}>Logout</button>
        <h1>Upload to Google Drive</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Upload File</p>
        <input type='file' name='file' onChange={(obj) => onUpload(obj)}></input>
      </header>
    </div>
  );
}

function App() {
  return (
    <Login></Login>
  )

}

export default App;
