import dotenv from "dotenv";
dotenv.config();
import contentful from 'contentful';
import nunjucks from 'nunjucks';

const { configure } = nunjucks;
const { createClient } = contentful;

if(process.env.CONTENTFUL_SPACE_ID === undefined || process.env.CONTENTFUL_SECRET === undefined || process.env.PREVIEW_CONTENTFUL_SECRET === undefined) {
    throw new Error("Contentful space id or secret is missing");
}

// ============ SETUP CONFIGURATION START ===============
let contentfulConfig = {
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_SECRET,
    environment: 'master',
};

if(process.argv[3] === 'preview') {
    contentfulConfig = { ...contentfulConfig, ...{ host: 'preview.contentful.com', accessToken: process.env.PREVIEW_CONTENTFUL_SECRET }}
}

configure('templates', { autoescape: false });

export const client = createClient(contentfulConfig);
export const templateRenderer = nunjucks;
// ============ SETUP CONFIGURATION END ===============
