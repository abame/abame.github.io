const config = require('./config');
const helpers = require('./helpers');
const fse = require('fs-extra');

config.client.getEntries({order: 'sys.createdAt', content_type: 'learningPath'}).then(entries => {
    const careerTypes = entries.items.map(entry => {
        return {
            careerType: helpers.toKebabCase(entry.fields.careerType),
            learningTypeDirectory: helpers.toKebabCase(entry.fields.learningType),
            learningTypeName: entry.fields.learningType
        };
    });

    const itemsGroupedByCareerType = helpers.groupByProperty(entries.items.map(entry => entry.fields), "careerType");

    const groupedCareerTypes = Object.entries(helpers.groupByProperty(careerTypes, "careerType"));
    for (const [careerType, learningTypes] of groupedCareerTypes) {
        const uniqueLearningTypes = [...new Map(learningTypes.map(item => [item[item.learningTypeName], item])).values()];
        for (const learningType of uniqueLearningTypes) {
            const learningPathTypeHtml = config.templateRenderer.render(`learning-path-type.html`, {
                ...learningType,
                items: itemsGroupedByCareerType[helpers.capitalize(careerType)]
            });
            fse.outputFileSync(`../learning-paths/${careerType}/${learningType.learningTypeDirectory}/index.html`, learningPathTypeHtml);
        }
        const html = config.templateRenderer.render(`learning-path-homepage.html`, {
            items: uniqueLearningTypes
        });
        fse.outputFileSync(`../learning-paths/index.html`, html);
    }
});
