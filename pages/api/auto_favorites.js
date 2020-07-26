export default function (req, res) {
    const {
        query: { keyword, num, twitter_access_token_key, twitter_access_token_secret },
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
            favTweets.push(await fav)
            sleep(getRandomInt(11))
        }
        return favTweets
    }
    const ftl = favTweets(keyword, num)
    ftl
        .then(r => res.status(200).json({ message: r }))
        .catch(e => res.status(400).json({ message: e.message }))
}

function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n * 1000);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}