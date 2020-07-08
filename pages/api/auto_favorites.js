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
    async function favTweets(keyword, num) {
        var favTweets = []
        const tweets = await client.get('search/tweets', { q: keyword, count: num })
        for (var tweet of tweets.statuses) {
            const fav = await client.post('favorites/create', { id: tweet.id_str })
            favTweets.push(await fav.text)
        }
        return favTweets
    }
    const ftl = favTweets(keyword, 1)
    ftl.then(r => console.log(r)).catch(e => console.log(e))
    res.status(200).json({ message: "done" })
}