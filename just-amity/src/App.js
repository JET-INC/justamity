import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Application from "./Components/Application";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./Components/ProfilePage";
import { UserContext } from "./providers/UserProvider";
// import React from 'react';
import logo from './SunAndCloud.png';

function App() {
  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <a
          className="App-link"
          href="https://www.linkedin.com/in/jasmine-bae"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out our LinkedIn!
        </a>
      </header>
    </div>
    <UserProvider>
  <Application />
</UserProvider>
  );
}

export default App;
