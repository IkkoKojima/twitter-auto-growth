import SignInOutButton from './SignInOutButton'
import styles from './AppHeader.module.css'
import { Grid, Header, Icon } from 'semantic-ui-react'

export default function AppHeader({
    signedInUser,
    signInWithTwitter,
    signOut
}) {
    return (
        <Grid verticalAlign="middle" textAlign="center" columns='equal' className={styles.header}>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h1" style={{ margin: "30px 0 0 0", color: "white" }}>
                        <Icon name="twitter" />
                        Twitter 自動いいね君
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column />
                <Grid.Column width={10}>
                    <SignInOutButton signedInUser={signedInUser} signInWithTwitter={signInWithTwitter} signOut={signOut} />
                </Grid.Column>
                <Grid.Column />
            </Grid.Row>
        </Grid>
    )
}