const extReadHtml = require('./ext/read-html');
const extApplyTemplate = require('./ext/apply-template');
const extFileExist = require('./ext/file-exist');
const extVerifyFiles = require('./ext/verify-files');
const extHighlightCode = require('./ext/highlight-code');

const extReadAsciidoc = require('./ext/read-asciidoctor');
const extReadIndex = require('./ext/read-index');

const extConvertToHtml = require('./ext/convert-to-html');
const extConvertToJson = require('./ext/convert-to-json');
const extConvertToRss = require('./ext/convert-to-rss');
const extConvertToSitemap = require('./ext/convert-to-sitemap');
const extConvertToArticlesList = require('./ext/convert-to-articles-list');
const extConvertToArticlesPage = require('./ext/convert-to-articles-page');

const isProd = process.env.NODE_ENV && process.env.NODE_ENV === 'prod';

const checkOptions = (options) => {
  if (!options.path) {
    options.path = '../../../';
  }
  if(!options.metadata){
    options.metadata = {};
    if(!options.metadata.rss){
      options.metadata.rss = 'src/metadata/rss.json';
    }
    if(!options.metadata.articles){
      options.metadata.articles = 'src/metadata/articles.json';
    }
    if(!options.metadata.html){
      options.metadata.html = 'src/metadata/html.json';
    }
    if(!options.metadata.sitemap){
      options.metadata.sitemap = 'src/metadata/sitemap.json';
    }
  }
  options.modeDev = !isProd;
  console.log(`Running in ${isProd ? 'PROD' : 'DEV'} mode`);
};

function website(options) {
  if (!options) {
    options = {};
  }
  checkOptions(options);
  return {
    applyTemplate: (handlebarsTemplateFile, partials) => extApplyTemplate(options, handlebarsTemplateFile, partials),

    extVerifyFiles : () => extVerifyFiles(options),
    fileExist: (filePath) => extFileExist(filePath),
    highlightCode: (selector) => extHighlightCode(selector),

    readAsciidoc: () => extReadAsciidoc(options),
    readHtml: () => extReadHtml(options),
    readIndex: () => extReadIndex(),

    convertToHtml: () => extConvertToHtml(),
    convertToJson: (fileName) => extConvertToJson(fileName),
    convertToRss: (filename) => extConvertToRss(options, filename),
    convertToSitemap: () => extConvertToSitemap(options),
    convertToArticlesList: (handlebarsTemplateFile, partials, filename, nbArticleMax) => extConvertToArticlesList(options, handlebarsTemplateFile, partials, filename, nbArticleMax),
    convertToArticlesPage: (handlebarsTemplateFile, partials, articlesIndexFile) => extConvertToArticlesPage(options, handlebarsTemplateFile, partials, articlesIndexFile)
  };
}
module.exports = website;