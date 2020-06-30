export default function (req, res) {
    const {
        query: { keyword, twitter_access_token_key, twitter_access_token_secret },
    } = req
    const Twitter = require('twitter')
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_TOKEN,
        access_token_key: twitter_access_token_key,
        access_token_secret: twitter_access_token_secret
    })
    client.get('search/tweets', { q: keyword, count: 10 }).then(function (tweets) {
        for (var tweet of tweets.statuses) {
            client.post('favorites/create', { id: tweet.id_str }).then(function (tweet) {
                console.log({ user: tweet.user.name, text: tweet.text })
                likedTweets.push({ user: tweet.user.name, text: tweet.text })
            }).catch(function (err) {
                console.log("error:" + err.message)
            })
        }
    });
    res.status(200).json({ message: "done" })
}