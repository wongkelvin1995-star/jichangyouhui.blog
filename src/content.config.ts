import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string().optional(),
  category: z.string(),
  brand: z.string().optional(),
  publishDate: z.string(),
  updatedDate: z.string(),
  author: z.string().default('机场优惠编辑部'),
  tags: z.array(z.string()).default([]),
  relatedBrands: z.array(z.string()).default([]),
  relatedArticles: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: articleSchema,
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: articleSchema,
});

export const collections = {
  articles,
  guides,
};
