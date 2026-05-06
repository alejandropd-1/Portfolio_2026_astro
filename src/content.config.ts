import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    year: z.string().optional(),
    date: z.string().or(z.date()), // Para el formato YYYY-MM-DD
    type: z.string().optional(),
    description: z.string().optional(),
    stack: z.array(z.string()).optional(),
    role: z.string().optional(),
    client: z.string().optional(),
    order: z.number().optional(),
    image: z.string().optional(),
    showInResume: z.boolean().default(false),
    showInPortfolio: z.boolean().default(false),
  })
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    email: z.string().optional(),
    status: z.string().optional(),
    mission: z.string().optional(),
  })
});

export const collections = {
  'projects': projectsCollection,
  'pages': pagesCollection,
};
