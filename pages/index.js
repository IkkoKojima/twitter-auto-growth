import * as firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import { Card, Image, Message, Form, Button, Grid } from 'semantic-ui-react'

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
  const [message, setMessage] = useState(0)
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
    firebase.auth().signOut().then(function () { setUser(undefined) }).catch(function (error) {
      console.log(error.code, error.message)
    })
  }

  async function autoFavorite(inputKeyword) {
    if (inputKeyword && credential) {
      setKeyword("")
      const response = await fetch(`${window.location.origin}/api/auto_favorite/${inputKeyword}?twitter_access_token_key=${credential.token}&twitter_access_token_secret=${credential.secret}`)
      if (response.ok) {
        setMessage(1)
      } else {
        setMessage(-1)
      }
    }
  }

  const displayMessage = () => {
    if (message == 0) {
      return (
        <Message>
          <Message.Header>
            キーワードを入力してください
              </Message.Header>
          <p>最大で10件のツイートが自動いいねされます</p>
        </Message>
      )
    }
    if (message == 1) {
      return (
        <Message success>
          <Message.Header>
            成功しました
              </Message.Header>
          <p>自動いいねに成功しました</p>
        </Message>
      )
    }
    return (
      <Message error>
        <Message.Header>
          失敗しました
              </Message.Header>
        <p>何らかの理由で自動いいねに失敗しました</p>
      </Message>
    )
  }

  return (
    <Grid verticalAlign="middle" textAlign="center" columns='equal'>
      <Grid.Row>
        <AppHeader signedInUser={user} signInWithTwitter={signInWithTwitter} signOut={signOut} />
      </Grid.Row>
      <Grid.Row>
        {user ?
          <Grid verticalAlign="top" textAlign="center" columns='equal' stackable>
            <Grid.Row>
              <Card>
                <Image src={user.photoURL} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{user.displayName}</Card.Header>
                </Card.Content>
              </Card>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {displayMessage()}
              </Grid.Column>
              <Grid.Column>
                <Form>
                  <Form.Field>
                    <label>いいねするキーワード</label>
                    <input type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value) }} />
                  </Form.Field>
                  <Button color="twitter" onClick={() => { autoFavorite(keyword) }}>いいね</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          :
          <Message>Twitterアカウントでサインインしてください</Message>
        }
      </Grid.Row>
    </Grid>
  )
}