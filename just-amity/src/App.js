import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Application from "./Components/Application";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./Components/ProfilePage";
import { UserContext } from "./providers/UserProvider";
// import React from 'react';
import logo from './SunAndCloud.png';
import './App.css';
import './firebase.js';

import './nav.css';
import { Fragment } from "react";
import { GoogleLogin } from 'react-google-login';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";
import { useHistory } from "react-router-dom";
import { signInWithGoogle } from "./firebase";

function App() {
  return (
    <div className="App">
      <TopNavBar />
    </div>
//     <UserProvider>
//   <Application />
// <UserProvider />
  
  );
}

export default App;

class TopNavBar extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      signed: false
    };
    if (firebase.auth().currentUser) {
      this.state = {
        signed: true
      };
    }
  }
  
  logout = (event) => {
    firebase.auth().signOut();
    this.render()
  }
  
  render() {
    var signed = true;
    return (<Router>
      <main>
        <nav class="top">
        <div class="top">
          <a class="top-child"><Link to="/">Home</Link></a>
          <a class="top-child"><Link to="/about">About</Link></a>
          <a class="top-child"><Link to="/contact">Contact</Link></a>
          {this.state.signed && 
            <div><a class="top-child"><Link to="/profile">Profile</Link></a></div>
          }
          {!this.state.signed &&
            <div class="button-div"><Link to="/login"><button>Login</button></Link></div>
          }
          {this.state.signed &&
            <div class="button-div"><Link to="/logout"><button onClick={this.logout}>Logout</button></Link></div>
          }
        </div>
        </nav>

      <Route path="/" exact component={Home} />
      <Route path="/about"  component={About} />
      <Route path="/contact"  component={Contact} />
      <Route path="/profile"  component={Profile} />
      <Route path="/login"  component={Login} />
      <Route path="/logout"  component={Logout} />
      </main>
  </Router>)
  }
  
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ signed: firebase.auth().currentUser }), 250);
    if (this.state.signed) {
      clearInterval(this.interval);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
}

class Home extends React.Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>JustAmity</h2>
        <a className="App-link" href="https://www.linkedin.com/in/jasmine-bae" target="_blank" rel="noopener noreferrer">Check out our LinkedIn!</a>
      </header>
    );
  }
}  

class About extends React.Component {
  render() {
    console.log(firebase.auth().currentUser);
    return (
      <p>Y{"o".repeat(10)}</p>
    );
  }
}  

class Profile extends React.Component {
  render() {
    console.log(firebase.auth().currentUser);
    if (firebase.auth().currentUser) {
      return (
        //<p>Y{"o".repeat(10)}</p>
        <div>
          <img class="profile-img" src={firebase.auth().currentUser.photoURL}/>
          <p>{firebase.auth().currentUser.email}</p>
          <p><b>You currently have 0 friends.</b></p>
        </div>
      );
    }
    return (
      //<p>Y{"o".repeat(10)}</p>
      <p>No user signed in.</p>
    );
  }
}  

class Contact extends React.Component {
  render() {
    return (
      <a className="App-link" href="https://www.linkedin.com/in/jasmine-bae" target="_blank" rel="noopener noreferrer">Check out our LinkedIn!</a>
    );
  }
}  

class Login extends React.Component {
  render() {
    return (
      <SignIn
      /> 
    );
  }
}  

class Logout extends React.Component {
  render() {
    return (
      <p>You have been logged out.</p>
    );
  }
}  
