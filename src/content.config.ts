import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^.]*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    _template: z.string().optional(), // used by TinaCMS
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
    imagePortrait: z.string().optional(),
    showInResume: z.boolean().default(false),
    showInPortfolio: z.boolean().default(false),
    points: z.array(z.string()).optional(),
    status: z.string().optional(),
    impact: z.string().optional(),
    categories: z.array(z.string()).optional().default([]),
    timeline: z.string().optional(),
    codeSnippet: z.string().optional(),
  })
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    _template: z.string().optional(), // used by TinaCMS to identify the template
    title: z.string(),
    // Home
    titleAccent: z.string().optional(),
    timezone: z.string().optional(),
    // About
    mission: z.string().optional(),
    // Archive
    subtitle: z.string().optional(),
    // Resume – contact
    location: z.string().optional(),
    email: z.string().optional(),
    status: z.string().optional(),
    // Resume – skills
    skillGroups: z.array(z.object({
      category: z.string(),
      items: z.array(z.object({
        name: z.string(),
        value: z.string(),
      })),
    })).optional(),
    // Resume – education
    education: z.array(z.object({
      degree: z.string().optional(),
      institution: z.string().optional(),
      year: z.string().optional(),
    })).optional(),
  })
});

const globalCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/global" }),
  schema: z.object({
    copyright: z.string().optional(),
    links: z.array(z.object({
      name: z.string(),
      url: z.string(),
      icon: z.string().optional(),
    })).optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'pages': pagesCollection,
  'global': globalCollection,
};
