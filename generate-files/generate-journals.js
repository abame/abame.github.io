import { client, templateRenderer } from './config.js';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import fsExtra from 'fs-extra';

const { outputFileSync } = fsExtra;

client.getEntries({ order: 'sys.createdAt', content_type: 'journal' })
    .then((entries) => {
        const items = entries.items.map((item) => {
            return {
                title: item.fields.title,
                link: item.fields.url,
                description: documentToHtmlString(item.fields.excerpt),
                image: `https:${item.fields.image.fields.file.url}`
            }
         });
        const html = templateRenderer.render(`journals.html`, { articles: items });
        outputFileSync(`../journal.html`, html);
    });
