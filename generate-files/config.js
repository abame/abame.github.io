require('dotenv').config();
const contentful = require('contentful');
const nunjucks = require('nunjucks');

// ============ SETUP CONFIGURATION START ===============
let contentfulConfig = {
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_SECRET,
    environment: 'master',
};

if(process.argv[3] === 'preview') {
    contentfulConfig = { ...contentfulConfig, ...{ host: 'preview.contentful.com', accessToken: process.env.PREVIEW_CONTENTFUL_SECRET }}
}

nunjucks.configure('templates', { autoescape: false });

module.exports={
    client: contentful.createClient(contentfulConfig),
    templateRenderer: nunjucks
};
// ============ SETUP CONFIGURATION END ===============
