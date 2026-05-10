import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import matter from 'gray-matter';

// gray-matter reads image directly from raw MDX — p.data.image is unreliable in Astro v6
// (same pattern used in index.astro for categories)
const rawFiles = import.meta.glob<string>('../content/projects/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const imageMap: Record<string, string | null> = {};
for (const [path, content] of Object.entries(rawFiles)) {
  const slug = path.split('/').pop()!.replace('.mdx', '').toLowerCase();
  const raw = matter(content).data.image ?? null;
  // Skip SVGs — feed readers don't render them as thumbnails
  imageMap[slug] = raw && !raw.endsWith('.svg') ? raw : null;
}

function toAbsoluteUrl(imageField: string | null, site: URL): string | null {
  if (!imageField) return null;
  try {
    // Already absolute (e.g. picsum.photos)
    if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
      return imageField;
    }
    return new URL(imageField, site).href;
  } catch {
    return null;
  }
}

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
      const imageUrl = toAbsoluteUrl(imageMap[p.id] ?? null, site);

      const contentHtml = [
        imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width:100%;border-radius:4px;display:block;margin-bottom:16px;" />` : '',
        description ? `<p>${description}</p>` : '',
        p.data.role ? `<p><strong>Role:</strong> ${p.data.role}</p>` : '',
        p.data.stack?.length ? `<p><strong>Stack:</strong> ${p.data.stack.join(', ')}</p>` : '',
        `<p><a href="${projectUrl}">View project &rarr;</a></p>`,
      ].filter(Boolean).join('\n');

      const itemCustomData = [
        `<dc:creator><![CDATA[Alejandro Delgado]]></dc:creator>`,
        imageUrl ? `<media:content url="${imageUrl}" medium="image" width="1200" height="630"/>` : '',
        imageUrl ? `<media:thumbnail url="${imageUrl}"/>` : '',
      ].filter(Boolean).join('\n');

      return {
        title,
        description,
        pubDate: new Date(p.data.date),
        link: `/projects/${p.id}`,
        categories: p.data.stack ?? [],
        content: contentHtml,
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
