export const toKebabCase = string => string.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, '-').toLowerCase();
export const toCamelCase = (str) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export const groupByProperty = (arrayOfObjects = [], groupBy = "") => {
    return arrayOfObjects.reduce((result, item) => {
        if (item[groupBy] !== undefined) {
            const groupByProperty = item[groupBy];
            result[groupByProperty] = result[groupByProperty] ? result[groupByProperty] : [];
            result[groupByProperty].push(item);
            return result;
        }
      }, {});
};

export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
