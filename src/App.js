import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  //Sign In
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);

      })
      .catch(error => {
        const errorMessage = error.message;
        console.log(error);
        console.log(errorMessage);
      })

  }

  //Sign Out
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          isValid: false,
          existingUser: false
        }
        setUser(signedOutUser);
      })
      .catch(error => {
        console.log(Error);
      })
    console.log('click');
  }

  const is_valid_email = email => /(.+)@(.+){3,}\.(.+){3,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = event => {
    const createdUser = { ...user };
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
  }

  const handleChange = event => {
    const newUserInfo = {
      ...user
    };
    //perform validation
    let isValid = true;
    if (event.target.name === 'email') {
      isValid = is_valid_email(event.target.value);
    }
    if (event.target.name === 'password') {
      isValid = event.target.value.length > 6 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  
  //Create Account
  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(error => {
          console.log(error.message)
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = error.message;
          setUser(createdUser);
        })
    }
    else {
      console.log('form is not valid', { email: user.email, pass: user.password });
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(error => {
          console.log(error.message)
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = error.message;
          setUser(createdUser);
        })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App container-fluid">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn ? <p>Welcome, {user.name}</p> : <p>Please SignIn</p>
      }
      <h1>Our Authentication</h1>

      <input onChange={switchForm} type="checkbox" name="switchForm"  id="switchForm" />
      <label htmlFor="switchForm">Returning User</label>
      <form style={{display: user.existingUser ? 'block':'none'}} onSubmit={signInUser}>
        <input onBlur={handleChange} type="email" name="email" placeholder='Your email address' required />
        <br />
        <input onBlur={handleChange} type="password" name="password" placeholder='Your password' required />
        <br />
        <input type="submit" value="SignIn" />
      </form>

      <form style={{display: user.existingUser ? 'none':'block'}} onSubmit={createAccount}>
        <input onBlur={handleChange} type="text" name="name" placeholder='Your name' required />
        <br />
        <input onBlur={handleChange} type="email" name="email" placeholder='Your email address' required />
        <br />
        <input onBlur={handleChange} type="password" name="password" placeholder='Your password' required />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }

    </div>
  );
}

export default App;
