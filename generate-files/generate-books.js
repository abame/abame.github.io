const config = require('./config');
const fse = require('fs-extra');

config.client.getEntries({ order: 'sys.createdAt', content_type: 'recommendedBooks' })
    .then((entries) => {
        const html = config.templateRenderer.render(`recommended-books.html`, { books: entries.items.sort((a, b) => 0.5 - Math.random()) });
        fse.outputFileSync(`../recommended-books.html`, html);
    });
