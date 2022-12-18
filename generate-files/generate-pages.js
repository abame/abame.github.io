require('dotenv').config();
const contentful = require('contentful');
const nunjucks = require('nunjucks');
const fs = require('fs');
const richTextRenderer = require('@contentful/rich-text-html-renderer');

// ============ SETUP CONFIGURATION START ===============
let contentfulConfig = {
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_SECRET,
    environment: 'master',
};

if(process.argv[3] === 'preview') {
    contentfulConfig = { ...contentfulConfig, ...{ host: 'preview.contentful.com', accessToken: process.env.PREVIEW_CONTENTFUL_SECRET }}
}

const contentType = process.argv[2];
let directory = contentType === "blogPost" ? "posts" : undefined;
const defaultImage = '/img/bg-post.jpeg';

nunjucks.configure('templates', { autoescape: false });

const client = contentful.createClient(contentfulConfig);
// ============ SETUP CONFIGURATION END ===============

const kebabCase = string => string.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
const camalize = (str) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

client.getEntries({order: 'sys.createdAt', content_type: contentType})
    .then((entries) => {
        for (const entry of entries.items) {
            directory = entry.fields.learningType !== undefined ? camalize(entry.fields.learningType) : directory
            const groupedQuestionsAnswers = entry.fields.questionsAnswers !== undefined ? entry.fields.questionsAnswers.reduce(
                (result, item) => ({
                ...result,
                [item["group"]]: [{...item, answer: item.answer}],
                }), 
                {},
            ) : [];
            const image = entry.fields.headerBackgroundImage !== undefined ? `https:${entry.fields.headerBackgroundImage.fields.file.url}` : defaultImage;
            const html = nunjucks.render(`${kebabCase(contentType)}.html`, { 
                title: entry.fields.title,
                date: entry.sys.createdAt,
                backgroundImage: image,
                description: richTextRenderer.documentToHtmlString(entry.fields.description ?? ""),
                questionsAnswers: groupedQuestionsAnswers,
            });
            fs.writeFileSync(`../_${directory}/${entry.sys.createdAt.split('T')[0]}-${kebabCase(entry.fields.title)}.html`, html);
        }
    });
