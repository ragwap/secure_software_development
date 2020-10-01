import React, { useState } from 'react';
import logo from './drive.png';
import './App.css';
import axios from 'axios';

const hh = false;

// handleLogin

function Login() {
  return (
    <div className="Login">
      <header className="App-header">
        <button className="login">Login</button>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

function Home() {
  return (
    <div className="Home">
      <header className="App-header">
        <h1>Upload to Google Drive</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Upload File</p>
        <input type='file' name='file' ></input>
      </header>
    </div>
  );
}

function App() {
  if (hh) {
    return (
      <Home></Home>
    );
  }
  else {
    return (
      <Login></Login>
    );
  }
  
}

export default App;
