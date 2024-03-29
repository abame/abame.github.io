import { client, templateRenderer } from './config.js';
import { toCamelCase, groupByProperty, toKebabCase } from './helpers.js';
import fsExtra from 'fs-extra';
import moment from "moment";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { stripHtml } from "string-strip-html";

const { outputFileSync } = fsExtra;

const contentType = process.argv[2];
let directory = contentType === "blogPost" ? "posts" : undefined;
const defaultImage = '/img/bg-post.png';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

client.getEntries({order: 'sys.createdAt', content_type: contentType})
    .then((entries) => {
        for (const entry of entries.items) {
            directory = entry.fields.learningType !== undefined ? toCamelCase(entry.fields.learningType) : directory
            const groupedQuestionsAnswers = entry.fields.questionsAnswers !== undefined ? groupByProperty(entry.fields.questionsAnswers, "group") : [];
            let image = defaultImage;
            if (entry.fields.headerBackgroundImage !== undefined) {
                image = `https:${entry.fields.headerBackgroundImage.fields.file.url}`;
            }
            const description = documentToHtmlString(entry.fields.description ?? "");
            const html = templateRenderer.render(`${toKebabCase(contentType)}.html`, { 
                title: entry.fields.title,
                date: moment(entry.sys.createdAt).format('YYYY-MM-DDTHH:mm:ssZZ'),
                backgroundImage: image,
                description: description,
                metaDescription: stripHtml(description).result.substring(0, 160),
                questionsAnswers: groupedQuestionsAnswers,
                tags: entry.metadata.tags.map((tag) => capitalize(tag.sys.id.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))).join(', ')
            });
            outputFileSync(`../_${directory}/${entry.sys.createdAt.split('T')[0]}-${toKebabCase(entry.fields.title)}.html`, html);
        }
    });
