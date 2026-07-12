const fs = require("fs");
const ejs = require("ejs");

const templateCache = {};

function getCompiledTemplate(templatePath) {
    if (!templateCache[templatePath]) {
        const template = fs.readFileSync(templatePath, "utf8");
        templateCache[templatePath] = ejs.compile(template);
    }
    return templateCache[templatePath];
}

module.exports = { getCompiledTemplate };