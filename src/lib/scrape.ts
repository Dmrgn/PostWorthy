
// reddit-scraper.ts
import puppeteer from 'puppeteer';

interface RedditPost {
  title: string;
  author: string;
  subreddit: string;
  created: string;
  score: number;
  comments: number;
  url: string;
  icon: string;
  flair: string | null;
  body: string;
  permalink: string;
}

// executablePath: '/usr/bin/brave-browser', 

export async function scrapeRedditPosts(subreddit: string, postLimit: number) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Set viewport to mobile to match the Shreddit UI
  await page.setViewport({ width: 414, height: 896 });

  try {
    // Navigate to the Reddit URL
    await page.goto(`https://www.reddit.com/r/${subreddit}/`);

    // Wait for the first batch of posts to load
    await page.waitForSelector('shreddit-post', { timeout: 10000 });

    // Scroll to load more posts (adjust as needed)
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for content to load after scrolling
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract data
    const posts: RedditPost[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('shreddit-post')).map(post => {
        const shadowRoot = post.shadowRoot;
        if (!shadowRoot) return null;

        const title = post.getAttribute('post-title') ||
          post.querySelector('[slot="title"]')?.textContent?.trim() || '';

        const content = post.querySelector('[slot="text-body"]')?.textContent?.trim().split("\n").map(x=>x.trim()).join(" ") || '';

        const author = post.getAttribute('author') || '';
        const subreddit = post.getAttribute('subreddit-name') || '';
        const createdTimestamp = post.getAttribute('created-timestamp') || '';
        const score = parseInt(post.getAttribute('score') || '0', 10) || 0;
        const commentCount = parseInt(post.getAttribute('comment-count') || '0', 10) || 0;
        const url = post.getAttribute('content-href') || '';
        const icon = post.getAttribute('icon') || '';
        const permalink = post.getAttribute('permalink') || '';

        const flairElement = shadowRoot.querySelector('.flair-content');
        const flair = flairElement ? flairElement.textContent.trim() : null;

        const bodyElement = shadowRoot.querySelector('.md.feed-card-text-preview');
        const body = bodyElement ?
          Array.from(bodyElement.querySelectorAll('p'))
            .map(p => p.textContent?.trim() || '')
            .filter(text => text)
            .join('\n') :
          'No body text found';

        return {
          title,
          author,
          subreddit,
          created: createdTimestamp,
          score,
          comments: commentCount,
          url,
          icon,
          flair,
          body,
          permalink,
          content
        };
      }).filter(post => post !== null);
    });

    return posts;
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// // Run the scraper
// scrapeRedditPosts("saas", 10).then(x => {
//   console.log(x.length);
// });
