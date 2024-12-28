import Eleventy from '@11ty/eleventy';
import {createLogger} from '@alwatr/logger';

import eleventyConfig from './eleventy-config.mjs';

const logger = createLogger(__package_name__, true);

const rootDir = './src';
const outDir = './dist';

const eleventyInstance = new Eleventy(rootDir, outDir);
eleventyInstance.setConfig = eleventyConfig;
await eleventyInstance.reset;

export async function eleventyBuild({watchMode}) {
  logger.logMethodArgs?.('build', {watchMode});

  logger.logOther?.('📋 Copying assets...');
  const fontName = 'vazirmatn';

  if (watchMode) {
    logger.logOther?.('👀 Watching...');
    eleventyInstance.watch();
  }
  else {
    logger.logOther?.('🚀 Building...');
    await eleventyInstance.write();
    logger.logOther?.('✅ Done.');
  }
}

