const config = require('./config');
const helpers = require('./helpers');
const fse = require('fs-extra');
const richTextRenderer = require('@contentful/rich-text-html-renderer');

const contentType = process.argv[2];
let directory = contentType === "blogPost" ? "posts" : undefined;
const defaultImage = '/img/bg-post.webp';

config.client.getEntries({order: 'sys.createdAt', content_type: contentType})
    .then((entries) => {
        for (const entry of entries.items) {
            directory = entry.fields.learningType !== undefined ? helpers.toCamelCase(entry.fields.learningType) : directory
            const groupedQuestionsAnswers = entry.fields.questionsAnswers !== undefined ? helpers.groupByProperty(entry.fields.questionsAnswers, "group") : [];
            const image = entry.fields.headerBackgroundImage !== undefined ? `https:${entry.fields.headerBackgroundImage.fields.file.url}` : defaultImage;
            const html = config.templateRenderer.render(`${helpers.toKebabCase(contentType)}.html`, { 
                title: entry.fields.title,
                date: entry.sys.createdAt,
                backgroundImage: image,
                description: richTextRenderer.documentToHtmlString(entry.fields.description ?? ""),
                questionsAnswers: groupedQuestionsAnswers,
            });
            fse.outputFileSync(`../_${directory}/${entry.sys.createdAt.split('T')[0]}-${helpers.toKebabCase(entry.fields.title)}.html`, html);
        }
    });
