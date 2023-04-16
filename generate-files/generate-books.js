import { client, templateRenderer } from './config.js';
import fsExtra from 'fs-extra';

const { outputFileSync } = fsExtra;

client.getEntries({ order: 'sys.createdAt', content_type: 'recommendedBooks' })
    .then((entries) => {
        const html = templateRenderer.render(`recommended-books.html`, { books: entries.items.sort((a, b) => 0.5 - Math.random()) });
        outputFileSync(`../recommended-books.html`, html);
    });
