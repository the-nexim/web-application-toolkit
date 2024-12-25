import slugifyFilter from '@11ty/eleventy/src/Filters/Slugify.js';
import urlFilter from '@11ty/eleventy/src/Filters/Url.js';
import TemplateConfig from '@11ty/eleventy/src/TemplateConfig.js';
import directoryOutputPlugin from '@11ty/eleventy-plugin-directory-output';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';

import {minifyHtml} from './minify-html.mjs';
import {postcssBuild} from './postcss.mjs';
import {dateString, timeString, trim} from './util.mjs';
import {generateServiceWorker} from './workbox.mjs';

// https://github.com/11ty/eleventy/blob/v2.x/src/defaultConfig.js
/**
 * 11ty configuration.
 * @param {import("@11ty/eleventy").UserConfig} config
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
function _eleventyConfig(config) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let templateConfig = this;

  config.addPassthroughCopy({
    assets: '/',
    'assets/img/meta/favicon.ico': '/favicon.ico',
  });

  config.setServerOptions({
    liveReload: true,
    port: 8080,
    showAllHosts: true,

    /**
     * Whether DOM diffing updates are applied where possible instead of page reloads
     */
    domDiff: false,
  });

  config.additionalWatchTargets = ['site', 'shortcode', 'style', 'src', 'dist/es'];
  config.watchIgnores = new Set(['script']);

  let markdownLibrary = markdownIt({html: true, breaks: true, linkify: true})
    .use(markdownItAttrs) // required for enter manual set id for header
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(), // this can change create link mode
      level: 2, // apply to h2, h3 and ...., don't apply to h1
      tabIndex: false,
      slugify: slugifyFilter, // this slugify convert persian to english
    });
  config.setLibrary('md', markdownLibrary);

  // config.addFilter("slug", slugFilter);
  config.addFilter('slugify', slugifyFilter);

  // Add pathPrefix manually to a URL
  config.addFilter('url', function addPathPrefix(url, pathPrefixOverride) {
    let pathPrefix;
    if (pathPrefixOverride && typeof pathPrefixOverride === 'string') {
      pathPrefix = pathPrefixOverride;
    }
    else {
      pathPrefix = templateConfig.getPathPrefix();
    }

    return urlFilter.call(this, url, pathPrefix);
  });

  config.addFilter('log', (input, ...messages) => {
    console.log(input, ...messages);
  });

  // config.addFilter("serverlessUrl", serverlessUrlFilter);

  // config.addFilter("getCollectionItemIndex", function (collection, pageOverride) {
  //   return getCollectionItemIndex.call(this, collection, pageOverride);
  // });

  // config.addFilter("getCollectionItem", function (collection, pageOverride, langCode) {
  //   return getLocaleCollectionItem.call(this, config, collection, pageOverride, langCode, 0);
  // });
  // config.addFilter("getPreviousCollectionItem", function (collection, pageOverride, langCode) {
  //   return getLocaleCollectionItem.call(this, config, collection, pageOverride, langCode, -1);
  // });
  // config.addFilter("getNextCollectionItem", function (collection, pageOverride, langCode) {
  //   return getLocaleCollectionItem.call(this, config, collection, pageOverride, langCode, 1);
  // });

  config.addFilter('dateString', dateString);
  config.addFilter('timeString', timeString);
  config.addFilter('trim', trim);

  config.addPlugin(directoryOutputPlugin, {
    columns: {
      filesize: true,
      benchmark: true,
    },
    warningFileSize: 400 * 1000,
  });

  config.addTransform('minifyHtml', minifyHtml);
  config.addTransform('trim', trim);

  config.on('eleventy.after', postcssBuild);
  config.on('eleventy.after', generateServiceWorker);

  config.addExtension('data.cjs', {key: '11ty.js'});

  return {
    templateFormats: [
      // "liquid",
      // "ejs",
      // "hbs",
      // "mustache",
      // "haml",
      // "pug",
      // "html",
      'md',
      'njk',
      '11ty.js',
    ],
    // if your site lives in a subdirectory, change this
    pathPrefix: '/',
    markdownTemplateEngine: 'md',
    htmlTemplateEngine: 'njk',
    htmlOutputSuffix: '-o',

    handlebarsHelpers: {},
    nunjucksFilters: {},

    // Renamed from `jsDataFileSuffix` in 2.0 (and swapped to an Array)
    // If you remove "" we won’t look for dir/dir.json or file.json
    dataFileSuffixes: ['.11tydata', ''],

    // "index" will look for `directory/index.*` directory data files instead of `directory/directory.*`
    dataFileDirBaseNameOverride: false,

    keys: {
      package: 'pkg',
      layout: 'layout',
      permalink: 'permalink',
      permalinkRoot: 'permalinkBypassOutputDir',
      engineOverride: 'templateEngineOverride',
      computed: 'eleventyComputed',
    },

    dir: {
      input: 'site',
      output: 'dist',
      includes: '_include',
      data: '_data',
      layouts: '_layout',
    },
  };
}

export const eleventyConfig = new TemplateConfig(_eleventyConfig);
