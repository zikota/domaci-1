import './App.css';
import React from 'react';
import { useState, useEffect } from 'react'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';


function App() {
  const [ username, setUsername ] = useState("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const [ formOk, setFormOk ] = useState();

  function handleClick(e) {
      e.preventDefault();
      let errorsCount = 0;
      setErrors([]);
      if (username.length < 6 || username.length > 12)
      {
        setErrors(errors => [...errors, 1]);
        createNotification('error', 1);
        errorsCount++;
      }
        
      if (firstName === '' ){
        setErrors(errors => [...errors, 2]);
        createNotification('error', 2);
        errorsCount++;
      }
        
      if (lastName === ''){
        setErrors(errors => [...errors, 3]);
        createNotification('error', 3);
        errorsCount++;
      }
      if (password !== confirmPassword){
        setErrors(errors => [...errors, 4]);
        createNotification('error', 4);
        errorsCount++;
      }

      let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

      if (!regexEmail.test(email)) {
        setErrors(errors => [...errors, 5]);
        createNotification('error', 5);
        errorsCount++;
      }

      let regexPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&\*])(?=.{8,})");
      if (!regexPass.test(password))
      {
        setErrors(errors => [...errors, 6]);
        createNotification('error', 6);
        errorsCount++;
      }
      if (errorsCount > 0)
        setFormOk(false);
      else 
        setFormOk(true);
  }
  
  function postBlob(data){ 
    
    fetch('https://jsonblob.com/api/jsonBlob', 
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'redirect': 'follow'
            },
            body: JSON.stringify({data})
        })
    .then(function(response) {
      let blobUrl=  response.headers.get('Location'); 
      console.log(blobUrl);
      setErrors(errors => [...errors, 7]);
      createNotification('success', 7);
      clearForm();
    })
    .catch(function(error){
        setErrors(errors => [...errors, 8]);
        createNotification('error', 8);
        clearForm();
    });
  }

  function createNotification (type, errorID){
    
    let msg = "";
    if (errorID === 1)
      msg = "Username length must be between 6 and 12 characters.";
    else if (errorID === 2)
      msg = "First Name is a required field.";
    else if (errorID === 3)
      msg = "Last Name is a required field.";
    else if (errorID === 4)
      msg = "Password and Confirm Password fields must match.";
    else if (errorID === 5)
      msg = "Email format is not correct.";
    else if (errorID === 6)
      msg = "Password must contain 8 characters, at least one uppercase letter, at least one lowercase letter, at least 1 numeric character and at least one special character.";
    else if (errorID === 8)
      msg = "Registration failed.";
    switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success('', 'Registration successful.');
          break;
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('', msg, 5000, () => {
            alert('callback');
          });
          break;
        }
    };

  function clearForm ()
  {
    setUsername('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors([]);
  }

  useEffect ( () => {
    if(formOk)
    {
      var obj = JSON.parse(`{ "username":"${username}", "firstName":"${firstName}", "lastName":"${lastName}", "email":"${email}", "password":"${password}"}`);
      postBlob(obj);
    }
  }, [formOk])

  return (
    <div className="App">
      <div className="container">
        <h1>REGISTRATION</h1>
      <form className="ui form">
        <div className="field">
          <label>Username</label>
        <input type="text" name="username" className={ errors.indexOf(1) > -1 ? "invalid" : "" } placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}></input>
        </div>
        <div className="field">
          <label>First Name</label>
        <input type="text" name="firstName" className={ errors.indexOf(2) > -1 ? "invalid" : "" } placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}></input>
        </div>
        <div className="field">
          <label>Last Name</label>
          <input type="text" name="lastName" className={ errors.indexOf(3) > -1 ? "invalid" : "" } placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="text" name="email" className={ errors.indexOf(5) > -1 ? "invalid" : "" } placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" name="password" placeholder="Password" className={ errors.indexOf(4) > -1 || errors.indexOf(6) > -1 ? "invalid" : "" } value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className={ errors.indexOf(4) > -1 || errors.indexOf(6) > -1 ? "invalid" : "" } value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
        </div>
        <button className="ui button" type="submit" onClick={handleClick}>Submit</button>
      </form>
      <NotificationContainer/>
      </div>
    </div>
  );
}

export default App;
