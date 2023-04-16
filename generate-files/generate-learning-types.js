import { client, templateRenderer } from './config.js';
import { toKebabCase, groupByProperty, capitalize } from './helpers.js';
import fsExtra from 'fs-extra';

const { outputFileSync } = fsExtra;

client.getEntries({order: 'sys.createdAt', content_type: 'learningPath'}).then(entries => {
    const careerTypes = entries.items.map(entry => {
        return {
            careerType: toKebabCase(entry.fields.careerType),
            learningTypeDirectory: toKebabCase(entry.fields.learningType),
            learningTypeName: entry.fields.learningType
        };
    });

    const itemsGroupedByCareerType = groupByProperty(entries.items.map(entry => entry.fields), "careerType");

    const groupedCareerTypes = Object.entries(groupByProperty(careerTypes, "careerType"));
    for (const [careerType, learningTypes] of groupedCareerTypes) {
        const uniqueLearningTypes = [...new Map(learningTypes.map(item => [item[item.learningTypeName], item])).values()];
        for (const learningType of uniqueLearningTypes) {
            const learningPathTypeHtml = templateRenderer.render(`learning-path-type.html`, {
                ...learningType,
                items: itemsGroupedByCareerType[capitalize(careerType)]
            });
            outputFileSync(`../learning-paths/${careerType}/${learningType.learningTypeDirectory}/index.html`, learningPathTypeHtml);
        }
        const html = templateRenderer.render(`learning-path-homepage.html`, {
            items: uniqueLearningTypes
        });
        outputFileSync(`../learning-paths/index.html`, html);
    }
});
