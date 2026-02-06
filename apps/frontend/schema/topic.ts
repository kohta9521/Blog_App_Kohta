import { z } from "zod";

export const TopicSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
  topic: z.string(),
});

export const TopicsResponseSchema = z.object({
  contents: z.array(TopicSchema),
  totalCount: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type Topic = z.infer<typeof TopicSchema>;
export type TopicsResponse = z.infer<typeof TopicsResponseSchema>;
