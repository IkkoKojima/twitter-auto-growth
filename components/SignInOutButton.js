export default function SignInOutButton({
    signedInUser,
    signInWithTwitter,
    signOut
}) {
    return signedInUser ?
        <div>
            <button onClick={signOut}>SignOut</button>
        </div> :
        <button onClick={signInWithTwitter}>SignIn</button>

}