import * as firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import { Card, Image, Message, Form, Button, Grid, Feed, Loader, Dimmer } from 'semantic-ui-react'

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
  const [response, setResponse] = useState(undefined)
  const [credential, setCredential] = useState(undefined)
  const [message, setMessage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [favNum, setFavNum] = useState(10)
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

  async function autoFavorite(inputKeyword, num, token, secret) {
    if (inputKeyword && num && token && secret) {
      setKeyword("")
      const url = `${window.location.origin}/api/auto_favorites?keyword=${encodeURIComponent(inputKeyword)}&num=${num}&twitter_access_token_key=${token}&twitter_access_token_secret=${secret}`
      setLoading(true)
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log(data.message)
        setResponse(data.message)
        setMessage(1)
      } else {
        setMessage(-1)
      }
      setLoading(false)
    }
  }

  const displayMessage = () => {
    if (message == 0) {
      return (
        <Message>
          <Message.Header>
            キーワードを入力してください
              </Message.Header>
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

  const displayResponse = () => {
    return response ?
      <Card>
        <Card.Content>
          <Card.Header>いいねしたツイート</Card.Header>
        </Card.Content>
        <Card.Content>
          <Feed>
            {response.map(r =>
              <Feed.Event>
                <Feed.Label image={r.user.profile_image_url} />
                <Feed.Content>
                  <Feed.User content={<a href={'https://twitter.com/' + r.user.screen_name}>{r.user.name}</a>} />
                  <Feed.Date content={r.created_at} />
                  <Feed.Summary>
                    {r.text}
                  </Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            )}
          </Feed>
        </Card.Content>
      </Card>
      : <div />
  }

  const loadingNow = () => {
    return loading ?
      <Loader active inline size='massive'>自動いいね中</Loader>
      :
      <div />
  }

  return (
    <Grid verticalAlign="middle" textAlign="center" columns='equal'>
      <Grid.Row>
        <AppHeader signedInUser={user} signInWithTwitter={signInWithTwitter} signOut={signOut} />
      </Grid.Row>
      <Grid.Row style={{ margin: "20px 0 0" }}>
        {user ?
          <Grid verticalAlign="top" textAlign="center" columns='equal' stackable>
            <Grid.Row>
              <Card>
                <Image src={user.photoURL.replace("_normal", "")} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{user.displayName}</Card.Header>
                </Card.Content>
              </Card>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {displayMessage()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form>
                  <Form.Field>
                    <label>自動いいねするキーワード</label>
                    <input type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value) }} />
                    <label>最大で{favNum}件のツイートが自動いいねされます</label>
                    <input
                      type='range'
                      min={1}
                      max={100}
                      value={favNum}
                      onChange={(e) => setFavNum(e.target.value)}
                    />
                    <label>アカウント凍結防止のために1ツイートあたり1~10秒のランダムクールタイムがあります</label>
                  </Form.Field>
                  <Button color="twitter" disabled={!keyword || loading} onClick={() => { autoFavorite(keyword, favNum, credential.token, credential.secret) }}>いいね</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              {loadingNow()}
            </Grid.Row>
            <Grid.Row>
              {displayResponse()}
            </Grid.Row>
          </Grid>
          :
          <Message>Twitterアカウントでサインインしてください</Message>
        }
      </Grid.Row>
    </Grid>
  )
}