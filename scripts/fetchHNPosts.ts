import { HackerNews } from '@/lib/social/hackerNews';
import axios from 'axios';

async function fetchHNPosts(url: string) {
  const { data } = await axios.get(url);

  for (const postId of data.slice(0, 20)) {
    const date = new Date();
    const social = new HackerNews();
    await social.createPost(parseInt(postId));
    console.info(`Fetched post ${postId} in ${((new Date().getTime() - date.getTime()) / 1000).toFixed(2)}s`);
  }
}

const main = async () => {
  await fetchHNPosts('https://hacker-news.firebaseio.com/v0/showstories.json');
  await fetchHNPosts('https://hacker-news.firebaseio.com/v0/topstories.json');
};

main();
