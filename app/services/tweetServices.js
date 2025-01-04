import Tweet from "../models/Tweet";
import TweetRepository from "../repository/tweetRepository";
class TweetServices {
    async createTweet(tweet) {
        const tweetRepository = new TweetRepository();
        return await tweetRepository;
  }

  async getTweets() {
    return await Tweet.find();
  }
}