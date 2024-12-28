// import slugify from '@sindresorhus/slugify';
import directoryOutputPlugin from '@11ty/eleventy-plugin-directory-output';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';

import {minifyHtml} from './minify-html.js';
import {postcssBuild} from './postcss.js';
import {trim} from './util/trim.js';
import {dateString, timeString} from './util/date-filters.js';
import {generateServiceWorker} from './workbox.js';
import UpgradeHelper from '@11ty/eleventy-upgrade-help';

// https://github.com/11ty/eleventy/blob/v2.x/src/defaultConfig.js
/**
 * 11ty configuration.
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {Record<string, any>} custom
 * @returns {ReturnType<import("@11ty/eleventy").UserConfig>}
 */
export default function (eleventyConfig, custom) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  eleventyConfig.addPlugin(UpgradeHelper);

  eleventyConfig.addPassthroughCopy({
    assets: '/',
    'assets/img/meta/favicon.ico': '/favicon.ico',
  });

  eleventyConfig.addWatchTarget([
    'site', // templates root Directory
    'shortcode', // shortcodes Directory
    'style', // styles Directory
    'dist/es', // building typescript Directory
  ]);

  /**
   * Watch javascript dependencies
   */
  eleventyConfig.setWatchJavaScriptDependencies(true);

  /**
   * Set markdown parser
   */
  let markdownLibrary = markdownIt({html: true, breaks: true, linkify: true})
    .use(markdownItAttrs) // required for enter manual set id for header
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(), // this can change create link mode
      level: 2, // apply to h2, h3 and ...., don't apply to h1
      tabIndex: false,
      // slugify: slugify, // this slugify convert persian to english so must set custom slugify
    });
  eleventyConfig.setLibrary('md', markdownLibrary);

  /**
   * Date related filter
   */
  eleventyConfig.addFilter('dateString', dateString);
  eleventyConfig.addFilter('timeString', timeString);

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
  eleventyConfig.addExtension('template.cjs', { key: '11ty.js' });

  /**
   * Set data root directory and base name of file
   */
  eleventyConfig.setDataFileSuffixes(['.data']);
  eleventyConfig.setDataFileBaseName('index');

  /**
   * Add Html, Nunjucks, Markdown, Tsx, Jsx, for template engines
   */
  eleventyConfig.templateFormats = [
      'md',
      'njk',
      '11ty.js']
}
