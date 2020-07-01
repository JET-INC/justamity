import React from 'react';
import ReactDOM from 'react-dom';
import './nav.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Fragment } from "react";

class TopNavBar extends React.Component {
  render() {
    return (<Router>
      <main>
        <nav class="top">
        <div class="top">
          <a class="top-child"><Link to="/">Home</Link></a>
          <a class="top-child"><Link to="/about">About</Link></a>
          <a class="top-child"><Link to="/contact">Contact</Link></a>
          <div class="button-div"><Link to="/login"><button>Login</button></Link></div>
        </div>
        </nav>

      <Route path="/" exact component={Home} />
      <Route path="/about"  component={About} />
      <Route path="/contact"  component={Contact} />

      </main>
  </Router>)
  }
}

export default TopNavBar;

const Home = () => (
  <p>hello</p>
);

const About = () => (
  <div/>

);

const Contact = () => (
  <div/>
);