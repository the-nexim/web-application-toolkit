import {argv} from 'process';

import {eleventyBuild} from './eleventy-build.mjs';

const watchMode = argv.includes('--watch');

eleventyBuild({
  watchMode,
});
