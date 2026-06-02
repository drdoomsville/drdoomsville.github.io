import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tech: z.array(z.string()),
    role: z.string(),
    timeframe: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { projects };
