import { serve } from "bun";
import index from "./index.html";
import pdfParse from "pdf-parse";
import { scrapeRedditPosts } from "./lib/scrape";
import { getOpenRouterResponse, getCerebrasResponse } from "./lib/ai";
import { PostSchema } from "./lib/schemas";

const server = serve({
  routes: {
    "/": index,
    "/app": index,
    "/api/scrape-reddit": {
      async POST(req) {
        const { subreddit, postLimit } = await req.json();
        const posts = await scrapeRedditPosts(subreddit, postLimit);
        return Response.json({ posts });
      },
    },
    "/api/analyze-posts": {
      async POST(req) {
        const { posts } = await req.json();
        const prompt = `Analyze the following Reddit posts and provide a summary in the following JSON format, respond with the JSON object and nothing else, do not wrap it in \`\`\`:
{
  "keywords": [
    { "word": "string", "frequency": "number", "sentiment": "number 0-1" },
  ],
  "topics": [
    { "topic": "string", "percentage": "number, "posts": "number" },
  ],
  "sentiment": {
    "positive": "number",
    "neutral": "number",
    "negative": "number"
  },
  "engagement": [
    { "type": "High Engagement", "count": "number", "avgScore": "number" },
    { "type": "Medium Engagement", "count": "number", "avgScore": "number" },
    { "type": "Low Engagement", "count": "number", "avgScore": "number" }
  ],
  "insights": [
    "This should be a string talking about patterns you notice between posts that have high engagement.",
    "Also include things to avoid that low engagement posts do.",
    "You should have 3-5 of these!",
  ]
}

Posts:
${JSON.stringify(posts, null, 2)}`;
        const analysis = await getOpenRouterResponse(prompt);
        return Response.json({ analysis: JSON.parse(analysis) });
      },
    },
    "/api/generate-posts": {
      async POST(req) {
        const { analysis, ragContext, customPrompt, creativity, postCount } =
          await req.json();

        const contextText = ragContext.files
          .map((file: any) => `Document: ${file.name}\n${file.content}`)
          .join("\n\n");

        const prompt = `
          Based on the following analysis and context, generate a single social media post.
          Be critical in terms of scoring if the post is bad, or is not able to perfectly match the requirements.
          Note, most posts will have low engagement, but try to do as best as you can!

          **Analysis:**
          ${JSON.stringify(analysis.insights, null, 2)}

          **Brand & Marketing Context:**
          ${contextText}

          **Additional Instructions:**
          ${customPrompt || "N/A"}

          **Creativity Level:** ${creativity} (0.1=conservative, 1=very creative)

          **Output Format (JSON only, no \`\`\`):**
          {
            "content": "Your generated post content here.",
            "score": "number out of 100 with single decimal place",
            "engagement_prediction": "number from 0 to 10000",
            "relevance_score": "number out of 100",
            "brand_alignment": "number out of 100",
            "format": "text or tip or question or story",
            "hashtags": ["#example", "#post"],
            "estimated_reach": "number from 0 to 50000"
          }
        `;

        const posts = [];
        for (let i = 0; i < postCount; i++) {
          let retries = 0;
          while (retries < 2) {
            try {
              const post = await getCerebrasResponse(prompt);
              console.log(post);
              const parsed = JSON.parse(post);
              PostSchema.parse(parsed);
              posts.push(parsed);
              break; // Exit retry loop on success
            } catch (error) {
              console.error("Validation failed, retrying...", error);
              retries++;
            }
          }
          // Wait for 2 seconds before the next request
          if (i < postCount - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
        return Response.json({ posts });
      },
    },
    "/api/process-pdfs": {
      async POST(req) {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        const processedFiles = await Promise.all(
          files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const data = await pdfParse(Buffer.from(buffer));
            return {
              name: file.name,
              content: data.text,
            };
          })
        );

        return Response.json({ files: processedFiles });
      },
    },
  },
  development: true,
});

console.log(`Listening on ${server.url}`);
