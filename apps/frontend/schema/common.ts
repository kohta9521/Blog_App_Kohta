import { z } from "zod";

export const DateTimeFieldsSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
});
