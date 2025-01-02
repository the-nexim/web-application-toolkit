import {mkdir, cp} from 'fs/promises';
import {dirname, join} from 'path';

import {logger} from './logger.js';

export async function copyFont(fontName: string, outputDirectory: string): Promise<void> {
  logger.logMethodArgs?.('copyFont', {fontName, outputDir: outputDirectory});

  const resolvedOutputDirectory = join(outputDirectory, fontName);
  await mkdir(resolvedOutputDirectory, {recursive: true});

  // Generate npm package font path directory
  let fontPath = require.resolve('@alwatr/font');
  fontPath = dirname(fontPath);
  fontPath = join(fontPath, fontName);

  await cp(fontPath, resolvedOutputDirectory, {recursive: true, preserveTimestamps: true, force: true});

  logger.logStep?.('copyFont', 'copy-font', {resolvedOutputDirectory});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function eleventyCopyFont(eleventyConfig: any, fontName: string) {
  eleventyConfig.on('eleventy.before', ({runMode}: {runMode: string}) => {
    if (runMode )
      copyFont(fontName, 'dist/fonts');
  })
}
