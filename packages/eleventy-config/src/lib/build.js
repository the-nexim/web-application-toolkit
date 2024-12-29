import {argv} from 'process';

import {eleventyBuild} from './eleventy-build.js';

const watchMode = argv.includes('--watch');

eleventyBuild({
  watchMode,
});
