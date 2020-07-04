import React, { useContext } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { browserHistory } from 'react-router';
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
import { createBrowserHistory } from 'history';

import './nav.css';
import { Fragment } from "react";
import { GoogleLogin } from 'react-google-login';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";
import { useHistory } from "react-router-dom";
import { signInWithGoogle } from "./firebase";
import { Redirect } from 'react-router-dom';
var database = firebase.database();

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
    this.state = {
      signed: false,
      photo: null
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
          {this.state.signed && 
            <div><a class="top-child"><Link to="/messages">Messages</Link></a></div>
          }
          {!this.state.signed &&
            <div class="button-div"><Link to="/login"><button>Login</button></Link></div>
          }
          {this.state.signed &&
            <div class="profile-div">
              <Link class='grey' to="/profile">
                <img class="profile-img-head" src={this.state.photo}/>
                <p class="profile-top-right-name">{firebase.auth().currentUser.displayName}</p>
              </Link>
            </div>
          }
        </div>
        </nav>

      <Route path="/" exact component={Home} />
      <Route path="/justamity" exact component={Home} />
      <Route path="/about"  component={About} />
      <Route path="/contact"  component={Contact} />
      <Route path="/profile"  component={Profile} />
      <Route path="/messages"  component={Messages} />
      <Route path="/login"  component={Login} />
      <Route path="/logout"  component={Logout} />
      </main>
  </Router>)
  }
  
  componentDidMount() {
    document.title = "JustAmity";
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          signed: true,
          photo: firebase.auth().currentUser.photoURL
        });
      } else {
        this.setState({
          signed: false,
          photo: null
        });
      }
    });
  }
  componentWillUnmount() {
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
    return (
      <p>Y{"o".repeat(10)}</p>
    );
  }
}

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      uid: null,
      friends: 0,
      match: null
    };
  }
  
  match = () => {
    database.ref('matches').once('value').then((snapshot) => {
      var potentialFriends = snapshot.val();
      var match = null;
      console.log(potentialFriends);
      for (var i = 0; i < potentialFriends.length; i++) {
        if (!(potentialFriends[i] === this.state.uid)) {
          if (!potentialFriends[i] in this.state.contacts) {
            match = potentialFriends[i];
            break;
          }
        }
      }
      if (match) {
        database.ref('users/' + this.state.uid + '/contacts/' + match).set({
          messages: [[this.state.user.uid, 'Hello']]
        });
        database.ref('users/' + match + '/contacts/' + this.state.user.uid).set({
          messages: [[this.state.user.uid, 'Hello']]
        });
        this.setState({
          match: "yes"
        });
        setTimeout(() => {
          this.setState({
            match: null
          });
        },3000);
      } else {
        this.setState({
          match: "no"
        });
        setTimeout(() => {
          this.setState({
            match: null
          });
        },3000);
      }
    });

  }
  
  render() {
    if (firebase.auth().currentUser) {
      return (
        //<p>Y{"o".repeat(10)}</p>
        <div>
          <div>
            <img class="profile-img" src={firebase.auth().currentUser.photoURL}/>
            <p>{firebase.auth().currentUser.email}</p>
            <p><b>You currently have {this.state.friends} friend{this.state.friends != 1 && 's'}.</b></p>
            <button onClick={this.match}>Make a friend!!</button>
            <Link to="/logout"><button onClick={f => firebase.auth().signOut()}>Logout</button></Link>
          </div>
          {this.state.match && this.state.match === "yes" &&
            (<div class="footer" ref="toast-friend">
              <div class="toast">
                🦄 You made a friend! 🦄
              </div>
            </div>)
          }
          {this.state.match && this.state.match === "no" &&
            (<div class="footer" ref="toast-no-friend">
              <div class="toast-red">
                😥 No friends found. 😥
              </div>
            </div>)
          }
        </div>
      );
    }
    return (
      //<p>Y{"o".repeat(10)}</p>
      <p>No user signed in.</p>
    );
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var user = firebase.auth().currentUser;
        var users = firebase.database().ref('users/' + user.uid);
        users.on('value', (snapshot) => {
          if (!snapshot.exists()) {
            database.ref('users/' + user.uid).set({
              display_name: user.displayName,
              email: user.email,
              profile_picture : user.photoURL,
              uid: user.uid,
              active_chat: 'test'
            });
            database.ref('users/' + user.uid + '/contacts/test').set({
              messages: [['test', 'Hello']]
            });
            database.ref('users/' + 'test' + '/contacts/' + user.uid).set({
              messages: [['test', 'Hello']]
            });
            database.ref('profiles/' + user.uid).set({
              display_name: user.displayName,
              email: user.email,
              profile_picture : user.photoURL,
              uid: user.uid,
              active_chat: 'test'
            });
          } else {
            this.setState({
              contacts: snapshot.val().contacts
            });
          }
          this.setState({
            authenticated: true,
            user: user,
            uid: user.uid,
            friends: Object.keys(snapshot.val().contacts).length - 1

          });
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }
}  

class Messages extends React.Component {
  constructor() {
    super()
    this.state = {
      authenticated: false,
      inputValue: ''
    };
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var user = firebase.auth().currentUser;
        var users = firebase.database().ref('users/' + user.uid);
        users.once('value').then((snapshot0) => {
          firebase.database().ref('/profiles').once('value').then((data) => {
            this.setState({
              profiles: data.val()
            });
          });
        firebase.database().ref('/users/' + snapshot0.val().active_chat).once('value').then((snapshot) => {
          users.on('value', (snapshot2) => {
            this.setState({
              contactObj: snapshot.val(),
              contactRef: snapshot2.val().contacts[snapshot2.val().active_chat],
              authenticated: true,
              user: snapshot2.val(),
            });
          });
        });
      });
      firebase.database().ref('users/' + user.uid + '/active_chat').on('value', (snapshot) => {
        this.setState({
          activeChat: snapshot.val()
        });
        console.log(snapshot.val());
      });
      
        
      } else {

      }
    });
  }
  
  renderChatListItem = (contact) => {
    var lastMessage = this.state.user.contacts[contact].messages[this.state.user.contacts[contact].messages.length - 1];
    return (<div class={this.state.activeChat === contact ? "chat-list-item-active" : "chat-list-item"} onClick={() => {firebase.database().ref('users/' + this.state.user.uid).update({active_chat: contact});}}>
      <img class="chat-list-item-profile" src={this.state.profiles[contact].profile_picture}/>
      <div class="chat-list-item-text">
        <p class="chat-list-item-name">{this.state.profiles[contact].display_name}</p>
        <p class="chat-list-item-message">{lastMessage[1]}</p>
      </div>
    </div>);
  }
  
  contactObj = (id) => {
    return firebase.database().ref('/users/' + id).once('value');
  }
  
  renderChatList = () => {
    const chats = [];
    for (var contact in this.state.user.contacts) {
      chats.push(this.renderChatListItem(contact));
    }
    return chats;
  }
  
  writeUserMessage = (contact, message) => {
    var messageRef = firebase.database().ref('users/' + this.state.user.uid + '/contacts/' + contact + '/messages/' + this.state.user.contacts[contact].messages.length);
    messageRef.set({
        0: this.state.user.uid,
        1: message
    });
    
    var messageRefRecipient = firebase.database().ref('users/' + contact + '/contacts/' + this.state.user.uid + '/messages/' + this.state.user.contacts[contact].messages.length);
    messageRefRecipient.set({
        0: this.state.user.uid,
        1: message
    });
  }
  
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
  
  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Enter') {
        if (this.state.inputValue) {
          event.preventDefault();
          event.stopPropagation();
          this.writeUserMessage(this.state.activeChat, this.state.inputValue);
          this.setState({
            inputValue: ''
          });
        }
      }
    }
  
  renderChatFocus = (contact) => {
    const messages = [];
    for (let message of this.state.contactRef.messages) {
      if (message[0] === firebase.auth().currentUser.uid) {
        messages.push(
        <div class="chat-focus-bottom-right-outer">
          <div class="chat-focus-bottom-right">
            <p class="chat-focus-bottom-message-right">{message[1]}</p>
          </div>
        </div>);
      } else {
        messages.push(
        <div class="chat-focus-bottom-left-outer">
          <div class="chat-focus-bottom-left">
            <p class="chat-focus-bottom-message-left">{message[1]}</p>
          </div>
        </div>);
      }
    }
    return (
      <div class="chat-focus">
        <div class="chat-focus-top">
          <img class="chat-focus-top-profile" src={this.state.profiles[this.state.activeChat].profile_picture}/>
          <div class="chat-focus-top-text">
            <p class="chat-focus-top-name">{this.state.profiles[this.state.activeChat].display_name}</p>
            <p class="chat-focus-top-desc">Seattle, WA</p>
          </div>
        </div>
        <div class="chat-focus-messages">
          {messages}
          <div ref={(el) => { this.el = el; }} />
        </div>
        <div class="chat-focus-type">
          <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} onKeyDown={this.onKeyDown} placeholder="Type a message" class="chat-focus-type-input"/>
        </div>
      </div>);
  
  }
  
  render() {
    return (
      <div class="horizontal">
        <div class="chat-list">
          {this.state.authenticated && this.renderChatList()}
        </div>
        {this.state.authenticated && this.renderChatFocus(this.state.activeChat)}
      </div>
    );
  }
  
  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
  }
  
  componentDidMount() {
    
  }
  
  componentDidUpdate() {
    if (this.el) {
      this.scrollToBottom();
    }
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
  constructor() {
    super();
    this.state = {
      authenticated: false
    };
  }
  
  render() {
    return (
      <div>
        {!this.state.authenticated && <SignIn />}
        {this.state.authenticated && <Redirect to="/profile" />}
      </div>
    );
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }
}  

class Logout extends React.Component {
  render() {
    return (
      <p>You have been logged out.</p>
    );
  }
}  
