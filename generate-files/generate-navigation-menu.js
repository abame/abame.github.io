const config = require('./config');
const fse = require('fs-extra');

config.client.getEntry(process.env.NAVIGATION_ENTRY_ID, { include: 2 })
    .then((entry) => {
        const html = config.templateRenderer.render(`navbar.html`, { 
            logo: `http:/${entry.fields.logo.fields.file.url}`,
            items: entry.fields.items.map((item) => item.fields),
        });
        fse.outputFileSync(`../_includes/navbar.html`, html);
    });
