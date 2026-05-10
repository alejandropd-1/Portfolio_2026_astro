import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const projects = await getCollection('projects');

  const items = projects
    .filter(p => p.data.showInPortfolio !== false)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(p => ({
      title: p.data.title.replace(/\s*\/\/\s*/g, ' '),
      description: p.data.description ?? '',
      pubDate: new Date(p.data.date),
      link: `/projects/${p.id}`,
      categories: p.data.stack ?? [],
    }));

  return rss({
    title: 'AleDesign — Portfolio',
    description: 'UX/UI design projects and case studies by Alejandro Delgado.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
