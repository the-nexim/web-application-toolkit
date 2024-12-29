import directoryOutputPlugin from '@11ty/eleventy-plugin-directory-output';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';

import {minifyHtml} from './minify-html.js';
import {postcssBuild} from './postcss.js';
import {trim} from './util/trim.js';
import {generateServiceWorker} from './workbox.js';

/**
 * Configures Eleventy with nexi app specification and html minify, postcss, workbox, etc.
 *
 * @param eleventyConfig - The eleventy config
 * @returns The eleventyConfig return type
 *
 * @see https://www.11ty.dev/docs/config/
 * @see https://www.11ty.dev/docs/config-shapes/#optional-return-object
 *
 * @example
 * import {eleventyConfiguration} from '@nexim/eleventy-config';
 *
 * export default function (eleventyConfig) {
 *   return eleventyConfiguration(eleventyConfig);
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function eleventyConfiguration(eleventyConfig: any) {
  eleventyConfig.addPassthroughCopy({
    assets: '/',
    'assets/img/meta/favicon.ico': '/favicon.ico',
  });

  // templates root Directory
  eleventyConfig.addWatchTarget('site');

  // shortcodes Directory
  eleventyConfig.addWatchTarget('shortcode');

  // styles Directory
  eleventyConfig.addWatchTarget('style');

  // build target typescript Directory
  eleventyConfig.addWatchTarget('dist/es');

  /**
   * Watch javascript dependencies
   */
  eleventyConfig.setWatchJavaScriptDependencies(true);

  /**
   * Set markdown parser
   */
  const markdownLibrary = markdownIt({html: true, breaks: true, linkify: true})
    .use(markdownItAttrs) // required for enter manual set id for header
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(), // this can change create link mode
      level: 2, // apply to h2, h3 and ...., don't apply to h1
      tabIndex: false,
      // slugify: slugify, // this slugify convert persian to english so must set custom slugify
    });
  eleventyConfig.setLibrary('md', markdownLibrary);

  /**
   * Simple trim filter
   */
  eleventyConfig.addFilter('trim', trim);

  /**
   * Pretty log the outputs plugin after build success
   */
  eleventyConfig.addPlugin(directoryOutputPlugin, {
    columns: {
      filesize: true,
      benchmark: true,
    },
    warningFileSize: 400 * 1000,
  });

  /**
   * Transform Minify Html and Trim methods
   */
  eleventyConfig.addTransform('minifyHtml', minifyHtml);
  eleventyConfig.addTransform('trim', trim);

  /**
   * Set after eventListener for build css and service worker
   */
  eleventyConfig.on('eleventy.after', postcssBuild);
  eleventyConfig.on('eleventy.after', generateServiceWorker);

  /**
   * Add template cjs to extension
   */
  eleventyConfig.addExtension('template.cjs', {key: '11ty.js'});

  /**
   * Set data root directory and base name of file
   */
  eleventyConfig.setDataFileSuffixes(['.data']);
  eleventyConfig.setDataFileBaseName('index');

  /**
   * Add Html, Nunjucks, Markdown, Tsx, Jsx, for template engines
   */
  eleventyConfig.templateFormats = ['md', 'njk', '11ty.js'];

  return {
    // if your site lives in a subdirectory, change this
    pathPrefix: '/',
    markdownTemplateEngine: 'md',
    htmlTemplateEngine: 'njk',

    handlebarsHelpers: {},
    nunjucksFilters: {},

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
