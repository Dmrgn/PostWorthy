import { z } from 'zod';

export const PostSchema = z.object({
  content: z.string(),
  score: z.number(),
  engagement_prediction: z.number(),
  relevance_score: z.number(),
  brand_alignment: z.number(),
  format: z.string(),
  hashtags: z.array(z.string()),
  estimated_reach: z.number(),
});

export const PostsSchema = z.array(PostSchema);
