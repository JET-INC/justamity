import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";
import React from 'react';
import ReactDOM from 'react-dom';
import  { Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const firebaseConfig = {
    apiKey: "AIzaSyCd05CA651nbJSjfG3a_XXxhth8zfQhYaM",
    authDomain: "users-7ee42.firebaseapp.com",
    databaseURL: "https://users-7ee42.firebaseio.com",
    projectId: "users-7ee42",
    storageBucket: "users-7ee42.appspot.com",
    messagingSenderId: "385725692286",
    appId: "1:385725692286:web:9a3c58753800fa97d4db2f"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
  hd: "berkeley.edu"
});
export const signInWithGoogle = () => {
  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      var token = result.credential.accessToken;
 
      var user = result.user;
      console.log(getUserDocument());
    })
    .catch(function(error) {
      console.log("Error signing in:", error);
    });
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      userDocument
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

console.log(getUserDocument(1));

