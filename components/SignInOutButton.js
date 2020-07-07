import { Button, Icon } from 'semantic-ui-react'

export default function SignInOutButton({
    signedInUser,
    signInWithTwitter,
    signOut
}) {
    return signedInUser ?
        <div>
            <Button secondary yarn add semantic-ui-css onClick={signOut}>サインアウト</Button>
        </div> :
        <Button secondary onClick={signInWithTwitter}><Icon name='twitter' />Twitterでサインイン</Button>

}