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
    const groupedCareerTypes = Object.entries(helpers.groupByProperty(careerTypes, "careerType"));
    for (const [careerType, learningTypes] of groupedCareerTypes) {
        const uniqueLearningTypes = [...new Map(learningTypes.map(item => [item[item.learningTypeName], item])).values()];
        for (const learningType of uniqueLearningTypes) {
            const html = config.templateRenderer.render(`learning-path-type.html`, learningType);
            console.log(html)
            fse.outputFileSync(`../learning-paths/${careerType}/${learningType.learningTypeDirectory}/index.html`, html);
        }
    }
});
