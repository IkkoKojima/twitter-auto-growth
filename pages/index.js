import * as firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react'
import Header from '../components/Header'

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
  const [keyword, setKeyword] = useState("")
  const [response, setResponse] = useState([])
  const [credential, setCredential] = useState(undefined)
  // firebase.auth().onAuthStateChanged((user) => { user ? setUser(user) & console.log(user) : setUser(undefined) });

  // function signInWithTwitter() {
  //   const provider = new firebase.auth.TwitterAuthProvider();
  //   firebase.auth().signInWithPopup(provider).catch(function (error) {
  //     console.log(error.code, error.message)
  //   });
  // }

  function signInWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      const token = result.credential.accessToken;
      const secret = result.credential.secret;
      const user = result.user;
      setUser(user);
      setCredential({ token: token, secret: secret });
    })
  }

  function signOut() {
    firebase.auth().signOut().catch(function (error) {
      console.log(error.code, error.message)
    })
  }

  async function autoFavorite(inputKeyword) {
    if (inputKeyword && credential) {
      const response = await fetch(`${window.location.origin}/api/auto_favorite/${inputKeyword}?twitter_access_token_key=${credential.token}&twitter_access_token_secret=${credential.secret}`)
      const data = await response.json()
      setResponse(data)
    }
  }

  return (
    <div>
      <Header signedInUser={user} signInWithTwitter={signInWithTwitter} signOut={signOut} />
      {user ?
        <div>
          <p>ようこそ！ {user.displayName} さん</p>
          <p>テキストボックスに対象となるキーワードを入力してください</p>
          <p>10件のツイートが自動いいねされます</p>
          <input type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value) }} />
          <button onClick={() => { autoFavorite(keyword) }}>自動いいね</button>
        </div>
        :
        "Twitterアカウントでログインしてください"
      }
    </div>
  )
}