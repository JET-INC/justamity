import React, { useContext } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { browserHistory } from 'react-router';
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Application from "./Components/Application";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./Components/ProfilePage";
import { UserContext } from "./providers/UserProvider";
import logo2 from './amlogo.png';
import mailSymbol from './mail2.png'
import 'semantic-ui-css/semantic.min.css'
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
import { Button } from 'semantic-ui-react'
import { Progress } from 'semantic-ui-react'
import { Icon } from 'semantic-ui-react'
import { Header } from 'semantic-ui-react'
import { Label } from 'semantic-ui-react'
import { Dropdown } from 'semantic-ui-react'
import { Card, Feed } from 'semantic-ui-react'
import { Statistic } from 'semantic-ui-react'
import ReactTooltip from 'react-tooltip';

var database = firebase.database();

const options = [
  { value: 'chocolate', label: 'Left part of US' },
  { value: 'strawberry', label: 'Right part of US' },
  { value: 'vanilla', label: 'Top part of US' },
  { value: 'orange', label: 'Bottom part of US' }
];

const optionsInterests = [
  { value: 'cats', label: 'Cats' },
  { value: 'dogs', label: 'Dogs' },
  { value: 'birds', label: 'Birds' },
  { value: 'lizards', label: 'Lizards' }
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
        var contacts = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/contacts');
        contacts.on('value', (snapshot) => {
          var unreads = 0;
          for (var v in snapshot.val()) {
            if (snapshot.val()[v].unread) {
              unreads += 1;
            }
          }
          this.setState({
            unreads: unreads
          });
          console.log(unreads);
          console.log(this.state.unreads)
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
    this.setState({
      signed: false,
      photo: null,
      stateFetched: false
    });
    this.render();
  }

  render() {
    document.body.style.overflow = 'auto';
    return (<Router>
      <main>
        <nav class="top-scroll">
          <Link to="/"><img class="title-img" src={logo2}/></Link>
          <div class="links-div">
            <div class="links-div-link-div">
              <a class="links-div-link"><Link to="/">home</Link></a>
              <a class="links-div-link"><Link to="/about">about</Link></a>
              <a class="links-div-link"><Link to="/contact">contact</Link></a>
            </div>
            {!this.state.signed && this.state.stateFetched &&
              <Link to="/login"><Icon name="user circle outline icon" disabled size="big"/></Link>
            }
          </div>

          {this.state.signed &&
            <div class="profile-div">
              <Link to="/messages">
                <div class="symbol">
                  <Icon name="mail outline" size='big'/>
                  {this.state.unreads > 0 && (
                    <div class="notification-bubble">
                      <p class="notification-bubble-text">{this.state.unreads}</p>
                    </div>
                  )}
                </div>
              </Link>
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
          stateFetched: false
        });
      }
    });
  }

  render() {
    return (
      <div class="home-div">
      {this.state.signed && <Redirect to='/login'/>}
        <div class="home-bg">
          <div class="home-text">
            <p class="slogan">A New Way to</p>
            <p class="slogan-bold">CONNECT</p>
            <p class ="slogan-under">Staying home for the semester?<br/>Feeling lonely and bored?</p>
            <img class="home-img"/>
            <div class="horizontal-right">
                <div class="home-buttons-primary"> <Link to="/login">Sign Up</Link></div>
                <div class="home-buttons-primary"> <Link to="/login">Login</Link></div>
            </div>
          </div>
        </div>
        <div class="home-bg-second">
        </div>
        <footer>
          <div class="footer-bg">
            <div class="footer-content">
              <div class="footer-column">
                <p class="footer-column-title">Company</p>
                <p class="footer-column-links">About Us</p>
                <p class="footer-column-links">Careers</p>
                <p class="footer-column-links">Terms</p>
                <p class="footer-column-links">Privacy</p>
              </div>
              <div class="footer-column">
                <p class="footer-column-title">Work With Us</p>
                <p class="footer-column-links">Friends</p>
                <p class="footer-column-links">Advertise</p>

              </div>
              <div class="footer-column">
                <p class="footer-column-title">Support</p>
                <p class="footer-column-links">$10</p>
                <p class="footer-column-links">$100</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

class Contact extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <a href="https://www.facebook.com/justamity">
              <i class="fa fa-facebook" aria-hidden="true"></i>
              <span> - Facebook</span>
            </a>
          </li>
          <li>
            <a href="https://www.twitter.com/just_amity">
              <i class="fa fa-twitter" aria-hidden="true"></i>
              <span> - Twitter</span>
            </a>
          </li>
          <li>
            <a href="mailto:jasmine.bae@berkeley.edu">
              <i class="fa fa-google-plus" aria-hidden="true"></i>
              <span> - Email</span>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/just_amity">
              <i class="fa fa-instagram" aria-hidden="true"></i>
              <span> - Instagram</span>
            </a>
          </li>
        </ul>
      </div>
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

  tags = (lst) => {
    var ret = [];
    for (var x in lst) {
      ret.push(
        <Label style={{width: "auto", margin: "2px"}}>
          <Icon name="user" />
          {lst[x]}
          <Icon name="close" />
        </Label>
      )
    }
    return ret
  }

  render() {
    if (firebase.auth().currentUser) {
      return (
        <div>
          <div class="profile-container">
            <div class="profile-left">
              <img class="profile-img" src={firebase.auth().currentUser.photoURL}/>
              <Header as="h2">{firebase.auth().currentUser.displayName}</Header>
              <div class="vertical" style={{margin: "10px"}}>
                <Statistic color='teal' size='mini'>
                  <Statistic.Label>Member since</Statistic.Label>
                  <Statistic.Value>Jan '20</Statistic.Value>
                </Statistic>
              </div>
              <Button color='teal' onClick={f => firebase.auth().signOut()}>Logout</Button>
            </div>
            {this.state.match && this.state.match === "yes" &&
              (<div class="footer-toast" ref="toast-friend">
                <div class="toast">
                  🦄 You made a friend! 🦄
                </div>
              </div>)
            }
            {this.state.match && this.state.match === "no" &&
              (<div class="footer-toast" ref="toast-no-friend">
                <div class="toast-red">
                  😥 No friends found. 😥
                </div>
              </div>)
            }
            <div class="profile-right">
              <div class="friends">
                <p class="profile-friends-title">Friends</p>
                <p class="profile-friends-count">You currently have {this.state.friends} friend{this.state.friends != 1 && 's'}.</p>
                <Progress data-tip="Your friend making energy<br>meter is recharging." percent={56} progress style={{margin: "10px 0px"}}/>
                <ReactTooltip place="bottom" effect="solid" offset={{top: 0, right: 75}} multiline="true" />
                <Button color='teal' onClick={this.match} style={{width: "150px"}}><Icon name='user' />Make friend</Button>
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
            <div class="profile-right-right">
              <div class="friends">
                <p class="profile-friends-title">Interests</p>
                <Select
                  onChange={null}
                  options={optionsInterests}
                  defaultValue={{ label: "Search for interest", value: 1 }}
                />
                <div class="horizontal-wrap">
                  {this.tags(["Bananas", "Rocket League", "Cats", "Phones", "Strings", "Shoes", "Hats"])}
                </div>
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

  renderSuggestions = () => {
    return (
      <div class="chat-suggestions-div">
        <img class="chat-suggestion-img" src="http://www.topdesignmag.com/wp-content/uploads/2012/05/5.-vintage-newspaper-ad.jpg"></img>
        <img class="chat-suggestion-img" src="https://i.pinimg.com/originals/0b/5f/67/0b5f6794c6c32f7c94cffd8f68d1a325.jpg"></img>
        <img class="chat-suggestion-img" src="https://c2.staticflickr.com/2/1593/25044909010_90d6a29099_b.jpg"></img>
      </div>
    )
  }

  render() {
    document.body.style.overflow = 'hidden';
    return (
      <div class="horizontal">
        <div class="chat-list">
          {this.state.authenticated && this.renderChatList()}
        </div>
        {this.state.authenticated && this.renderChatFocus(this.state.activeChat)}
        {this.state.authenticated && this.renderSuggestions()}
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

class About extends React.Component {
  render() {
    return (
      <div>
        We are cool Cal students with a mission.
      </div>
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
        {this.state.authenticated && <Redirect to="/messages" />}
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
    return (<div>
    <Redirect to="/justamity"/>
    </div>
  )
  }
}
