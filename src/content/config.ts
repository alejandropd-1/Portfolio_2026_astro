import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.string().optional(),
    date: z.coerce.date().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
    stack: z.array(z.string()).optional(),
    role: z.string().optional(),
    client: z.string().optional(),
    order: z.number().optional(),
    image: z.string().optional(),
    showInResume: z.boolean().optional(),
    showInPortfolio: z.boolean().optional(),
    status: z.string().optional(),
    impact: z.string().optional(),
    points: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { projects };
