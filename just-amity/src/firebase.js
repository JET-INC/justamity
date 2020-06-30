import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyALjXQRCCET-Y_5sFLV3ofj0wLs7VGhJns",
  authDomain: "justamity.firebaseapp.com",
  databaseURL: "https://justamity.firebaseio.com",
  projectId: "justamity",
  storageBucket: "justamity.appspot.com",
  messagingSenderId: "502952254044",
  appId: "1:502952254044:web:47df39709ecf57667ce499",
  measurementId: "G-R02QYTYWZ9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
  hd: "berkeley.edu"
});
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
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
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

//const provider = new firebase.auth.GoogleAuthProvider();
//     provider.setCustomParameters({
//   hd: "berkeley.edu"
// });
// firebase.auth().signInWithPopup(provider)
//   .then(function(result) {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     var token = result.credential.accessToken;
//
//     // The signed-in user info.
//     var user = result.user;
//
//     // ...
//   })
//   .catch(function(error) {
//     console.log("Error signing in:", error);
//   });
