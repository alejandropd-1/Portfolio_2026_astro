import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const projects = await getCollection('projects');
  const site = context.site!;

  const items = projects
    .filter(p => p.data.showInPortfolio !== false)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(p => {
      const title = p.data.title.replace(/\s*\/\/\s*/g, ' ');
      const description = p.data.description ?? '';
      const projectUrl = new URL(`/projects/${p.id}`, site).href;
      const imageUrl = p.data.image ? new URL(p.data.image, site).href : null;

      const contentParts = [
        imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width:100%;border-radius:4px;margin-bottom:16px;" />` : '',
        description ? `<p>${description}</p>` : '',
        p.data.role ? `<p><strong>Role:</strong> ${p.data.role}</p>` : '',
        p.data.stack?.length ? `<p><strong>Stack:</strong> ${p.data.stack.join(', ')}</p>` : '',
        `<p><a href="${projectUrl}">View project →</a></p>`,
      ].filter(Boolean).join('\n');

      const itemCustomData = [
        `<dc:creator><![CDATA[Alejandro Delgado]]></dc:creator>`,
        imageUrl ? `<media:content url="${imageUrl}" medium="image"/>` : '',
        imageUrl ? `<media:thumbnail url="${imageUrl}"/>` : '',
      ].filter(Boolean).join('\n');

      return {
        title,
        description,
        pubDate: new Date(p.data.date),
        link: `/projects/${p.id}`,
        categories: p.data.stack ?? [],
        content: contentParts,
        customData: itemCustomData,
      };
    });

  return rss({
    title: 'AleDesign — Portfolio',
    description: 'UX/UI design projects and case studies by Alejandro Delgado.',
    site,
    items,
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      content: 'http://purl.org/rss/1.0/modules/content/',
      atom: 'http://www.w3.org/2005/Atom',
      media: 'http://search.yahoo.com/mrss/',
    },
    customData: [
      '<language>en-us</language>',
      `<atom:link href="${new URL('rss.xml', site).href}" rel="self" type="application/rss+xml"/>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      '<generator>Astro</generator>',
    ].join('\n'),
  });
}
