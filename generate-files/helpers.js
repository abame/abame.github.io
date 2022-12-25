const kebabCase = string => string.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
const camalize = (str) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

const groupByProperty = (arrayOfObjects = [], groupBy = "") => {
    return arrayOfObjects.reduce((result, item) => {
        if (item[groupBy] !== undefined) {
            const groupByProperty = item[groupBy];
            result[groupByProperty] = result[groupByProperty] ? result[groupByProperty] : [];
            result[groupByProperty].push(item);
            return result;
        }
      }, {});
};

module.exports = {
    toKebabCase: kebabCase,
    toCamelCase: camalize,
    groupByProperty
}
