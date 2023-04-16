import { client, templateRenderer } from './config.js';
import fsExtra from 'fs-extra';

const { outputFileSync } = fsExtra;

client.getEntry(process.env.NAVIGATION_ENTRY_ID, { include: 2 })
    .then((entry) => {
        const html = templateRenderer.render(`navbar.html`, { 
            logo: `http:/${entry.fields.logo.fields.file.url}`,
            items: entry.fields.items.map((item) => item.fields),
        });
        outputFileSync(`../_includes/navbar.html`, html);
    });
