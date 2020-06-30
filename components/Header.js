import SignInOutButton from './SignInOutButton'

export default function Header({
    signedInUser,
    signInWithTwitter,
    signOut
}) {
    return (
        <div>
            <p>Twitter自動いいね</p>
            <SignInOutButton signedInUser={signedInUser} signInWithTwitter={signInWithTwitter} signOut={signOut} />
        </div>
    )
}