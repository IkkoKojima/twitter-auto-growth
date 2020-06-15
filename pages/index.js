import * as firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default function SignInOut() {
  const [user, setUser] = useState(undefined)
  firebase.auth().onAuthStateChanged((user) => { user ? setUser(user) : setUser(undefined) });

  function signInWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(function (error) {
      console.log(error.code, error.message)
    });
  }

  function signOut() {
    firebase.auth().signOut().catch(function (error) {
      console.log(error.code, error.message)
    })
  }

  function SignInOutButton() {
    return user ?
      <button onClick={signOut}>SignOut</button> :
      <button onClick={signInWithTwitter}>SignIn</button>

  }

  return <SignInOutButton />
}
