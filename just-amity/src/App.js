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
import logo2 from './sc2.png';
import mailSymbol from './mail.png'
import peopleBg from './people-happy.jpg'
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
import Select from 'react-select';

var database = firebase.database();

//Profile option that displays location
//TODO: Should be changed to not show on profile
const options = [
  { value: 'chocolate', label: 'Left part of US' },
  { value: 'strawberry', label: 'Right part of US' },
  { value: 'vanilla', label: 'Top part of US' },
  { value: 'orange', label: 'Bottom part of US' }
];

function App() {
  return (
    <div className="App">
      <TopNavBar />
    </div>
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
    document.title = "JustAmity";
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          signed: true,
          photo: firebase.auth().currentUser.photoURL,
          stateFetched: true
        });
      } else {
        this.setState({
          signed: false,
          photo: null,
          stateFetched: true
        });
      }
    });
  }

  logout = (event) => {
    firebase.auth().signOut();
    this.render()
  }

  render() {
    return (<Router>
      <main>
        <nav class="top">
          <Link to="/"><p class="title">JustAmity<img class="title-img" src={logo2}/></p></Link>
          <a class="top-child"><Link to="/about">About Us</Link></a>
          <a class="top-child"><Link to="/contact">Contact</Link></a>
          {!this.state.signed && this.state.stateFetched &&
            <div class="profile-div"><Link to="/login"><button>Login</button></Link></div>
          }
          {this.state.signed &&
            <div class="profile-div">
              <Link to="/messages"><img src={mailSymbol} class="symbol"/><div class="row"/></Link>
              <Link class='grey' to="/profile">
                <img class="profile-img-head" src={this.state.photo}/>
                <p class="profile-top-right-name">{firebase.auth().currentUser.displayName}</p>
              </Link>
            </div>
          }
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

  }
  componentWillUnmount() {
  }
}

class Home extends React.Component {
  render() {
    return (
      <div class="home-div">
        <p class="slogan">Meet your next favorite friend.</p>
        //TODO: Change Picture here
        <img class="home-img"src={peopleBg}/>
        <div class="horizontal-center">
          <div class="question-div">
            <p class="question-title">Deciding who to friend next?</p>
            <p class="question-answer">You’re in the right place. Tell us what topics or interests you’ve enjoyed in the past, and we’ll give you surprisingly insightful recommendations.</p>
          </div>
          <div class="question-div">
            <p class="question-title">What are your friends up to?</p>
            <p class="question-answer">Chances are your friends are discussing their favorite (and least favorite) things on JustAmity.</p>
          </div>
        </div>
      </div>
    );
  }
}

//Where did the aboutpage go?
//TODO: Add about page, with our pictures/names/etc
class About extends React.Component {
  render() {
    return (
      <p>We are a group of UC Berkeley students striving to lower visual biases in social media apps while fostering meaningful and safe platonic relationships for campus communities.</p>
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
              messages: [['test', 'Hi, welcome to Amity. Friendships start here.']]
            });
            database.ref('users/' + 'test' + '/contacts/' + user.uid).set({
              messages: [['test', 'Hi, welcome to Amity. Friendships start here.']]
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
            friends: Object.keys(snapshot.val().contacts).length - 1,
            location: snapshot.val().location
          });
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }

  match = () => {
    database.ref('matches').once('value').then((snapshot) => {
      var potentialFriends = snapshot.val();
      var match = null;
      console.log(potentialFriends);
      for (var i = 0; i < potentialFriends.length; i++) {
        if (!(potentialFriends[i] === this.state.uid)) {
          if (!(potentialFriends[i] in this.state.contacts)) {
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
        if (!(this.state.match === "yes")) {
          setTimeout(() => {
            this.setState({
              match: null
            });
          },3000);
          this.setState({
            match: "yes"
          });
        }
      } else {
        if (!(this.state.match === "no")) {
          setTimeout(() => {
            this.setState({
              match: null
            });
          },3000);
          this.setState({
            match: "no"
          });
        }
      }
    });
  }

  handleSelect = (e) => {
    console.log(e);
    var locationRef = firebase.database().ref('profiles/' + this.state.user.uid);
    locationRef.update({
        location: e.label
    });
    var locationProfileRef = firebase.database().ref('users/' + this.state.user.uid);
    locationRef.update({
        location: e.label
    });
  }

  render() {
    if (firebase.auth().currentUser) {
      return (
        <div>
          <div class="profile-container">
            <div class="profile-left">
              <img class="profile-img" src={firebase.auth().currentUser.photoURL}/>
              <h2>{firebase.auth().currentUser.displayName}</h2>
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
            <div class="profile-right">
              <div class="friends">
                <p class="profile-friends-title">Friends</p>
                <p class="profile-friends-count">You currently have {this.state.friends} friend{this.state.friends != 1 && 's'}.</p>
                <progress value="32" max="100"> 32% </progress>
                <button onClick={this.match}>Make a friend!!</button>
              </div>
              <div>
                <p class="profile-friends-title">Profile</p>
                <p class="profile-property-title">Location</p>
                {this.state.location &&
                <Select
                  onChange={this.handleSelect}
                  options={options}
                  defaultValue={{ label: this.state.location, value: 1 }}
                />}
                {!this.state.location &&
                <Select
                  onChange={this.handleSelect}
                  options={options}
                  defaultValue={{ label: "None", value: 1 }}
                />}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <p>No user signed in.</p>
    );
  }

  componentDidMount() {

  }
}

class Messages extends React.Component {
  colors = true;

  constructor() {
    super();
    this.state = {
      authenticated: false,
      inputValue: ''
    };
    var dt = new Date();
    console.log(dt);
    //TODO: Get rid of random users
    var randomColor = (function lol(m, s, c) {
                    return s[m.floor(m.random() * s.length)] +
                        (c && lol(m, s, c - 1));
                });
    console.log(randomColor(Math, '3456789ABCDEF', 4));
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
              user: snapshot2.val()
            });
            if (this.colors) {
              for (var contact in snapshot2.val().contacts) {
                this.setState({
                  [contact]: randomColor(Math, '356789ABCDEF', 4)
                });
              }
              this.colors = false;
            }
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
        //elsewhat?
      }
    });
  }

  renderChatListItem = (contact) => {
    var lastMessage = this.state.user.contacts[contact].messages[Object.keys(this.state.user.contacts[contact].messages).length - 1];
    var unread = this.state.user.contacts[contact].unread;
    return (<div onMouseOver={this.readMessage} class={this.state.activeChat === contact ? "chat-list-item-active" : "chat-list-item"} onClick={() => {firebase.database().ref('users/' + this.state.user.uid).update({active_chat: contact});}}>
      <img class="chat-list-item-profile" src={"https://ui-avatars.com/api/?length=1&background=" + this.state[contact] + "&color=fff&bold=true&name=" + this.state.profiles[contact].display_name.split(" ")[0]}/>
      <div class="chat-list-item-text">
        <p class={!unread ? "chat-list-item-name" : "chat-list-item-name-unread"}>{this.state.profiles[contact].display_name.split(" ")[0]}</p>
        <p class={!unread ? "chat-list-item-message" : "chat-list-item-message-unread"}>{lastMessage ? lastMessage[1] : ""}</p>
      </div>
    </div>);
  }

//get rid of this
  randomPhrase= () => {
    var song = Array("Hey whats up", "Haha thats really funny!", "That sounds really fun!", "Tfw when you are a cat", "Hello!", "Do you want to go get boba", "Yoooo uwu", "LOL", "Yes!", "Sorry I am busy. :(", "How are you doing?", "That's really cool!", "What do you think?", "LOL im in");
    return song[Math.floor(Math.random() * song.length)];
  }

  randomName= () => {
    var song = Array("John", "Jack", "Emma", "James", "Sarah", "Ronny", "Alex", "Jocelyn", "Bode", "Boser", "Gireeja", "Eva", "Evelyn", "Tom", "Hanna", "Jenny", "Kaley", "Helen", "Helena", "Amy", "Athena", "Bill", "Melinda");
    return song[Math.floor(Math.random() * song.length)];
  }

  randomColor = (function lol(m, s, c) {
                  return s[m.floor(m.random() * s.length)] +
                      (c && lol(m, s, c - 1));
              });

  renderFakeChatListItem = () => {
    var lastMessage = this.randomPhrase();
    var name = this.randomName();
    var unread = false;
    var color = this.randomColor(Math, '356789ABCDEF', 4);
    return (<div class="chat-list-item">
      <img class="chat-list-item-profile" src={"https://ui-avatars.com/api/?length=1&background=" + color + "&color=fff&bold=true&name=" + name}/>
      <div class="chat-list-item-text">
        <p class={!unread ? "chat-list-item-name" : "chat-list-item-name-unread"}>{name}</p>
        <p class={!unread ? "chat-list-item-message" : "chat-list-item-message-unread"}>{lastMessage ? lastMessage : ""}</p>
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
    for (var i = 0; i < 10; i++) {
      chats.push(this.renderFakeChatListItem());

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
    var messageRefRecipient = firebase.database().ref('users/' + contact + '/contacts/' + this.state.user.uid);
    messageRefRecipient.update({
        unread: true
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

  readMessage = (contact) => {
    if (contact) {
      var unreadRef = firebase.database().ref('users/' + this.state.user.uid + '/contacts/' + this.state.activeChat);
      unreadRef.update({
          unread: false
      });
    }
  }

  isIterable(obj) {
  // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

  renderChatFocus = (contact) => {
    const messages = [];
    console.log(this.state.contactRef);
    if (this.isIterable(this.state.contactRef.messages)) {
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
    }
    return (
      <div class="chat-focus" onMouseOver={this.readMessage}>
        <div class="chat-focus-top">
          <img class="chat-focus-top-profile" src={"https://ui-avatars.com/api/?length=1&background=" + this.state[contact] + "&color=fff&bold=true&name=" + this.state.profiles[contact].display_name.split(" ")[0]}/>
          <div class="chat-focus-top-text">
            <p class="chat-focus-top-name">{this.state.profiles[this.state.activeChat].display_name.split(" ")[0]}</p>
            <p class="chat-focus-top-desc">{this.state.profiles[this.state.activeChat].location}</p>
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

//What does this function do?
  componentDidMount() {

  }

  componentDidUpdate() {
    if (this.el) {
      this.scrollToBottom();
    }
  }
}

//TODO: Update contact page with Social Media + Email contact form
class Contact extends React.Component {
  render() {
    return (
      <a className="App-link" href="https://www.facebook.com/justamity" target="_blank" rel="noopener noreferrer">Facebook</a>
      <a className="App-link" href="https://twitter.com/just_amity" target="_blank" rel="noopener noreferrer">Twitter</a>
      <a className="App-link" href="https://www.instagram.com/just_amity/" target="_blank" rel="noopener noreferrer">Instagram</a>
      //add contact form here
    );
  }
}


/// Summary: Login Page
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


/// Summary: Logout Page
class Logout extends React.Component {
  render() {
    return (
      <p>You have been logged out.</p>
    );
  }
}
