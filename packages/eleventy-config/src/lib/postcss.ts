import {existsSync} from 'fs';
import {readFile, writeFile, mkdir, readdir} from 'fs/promises';
import {join} from 'node:path';

import {platformInfo} from '@alwatr/platform-info';
import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import postcssVariableCompress from 'postcss-variable-compress';
// @ts-expect-error - not type exists
import postcssViewportUnitFallback from 'postcss-viewport-unit-fallback';
import tailwindcss from 'tailwindcss';
import postcssNesting from 'tailwindcss/nesting/index.js';

import {logger} from './logger.js';

const basePath = 'style';

const postCssPlugins = [
  /* @__PURE__ */ postcssImport({root: basePath}),
  postcssNesting,
  tailwindcss,
  postcssViewportUnitFallback,
  postcssPresetEnv,
];

if (platformInfo.development !== true) {
  /* @__PURE__ */ postCssPlugins.push(postcssVariableCompress, cssnano({preset: ['default', {discardComments: {removeAll: true}}]}));
}

const postCss = /* @__PURE__ */ postcss(postCssPlugins);

export async function postcssBuild(): Promise<void> {
  logger.logMethod?.('postcssBuild');

  const inputDir = basePath;
  const outputDir = 'dist/css/';
  const startTime = Date.now();

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, {recursive: true});
  }

  const dirFileList = await readdir(inputDir);

  for (const fileName of dirFileList) {
    if (!fileName.endsWith('.css')) continue;

    const inputFilePath = join(inputDir, fileName);
    const outputFilePath = join(outputDir, fileName);

    let outputContent = '';

    try {
      const fileContent = await readFile(inputFilePath, 'utf8');
      outputContent = (await postCss.process(fileContent, {from: inputFilePath, to: outputFilePath})).css;
    }
    catch (err) {
      logger.error('postcssBuild', 'build_error', err);

      // Simple style to show error message
      outputContent = `
        html {
          background-color: #a11;
        }

        html:after {
          content: 'Postcss error!';
          display: block;
          margin-top: 2rem;
          font-size: 1.3rem;
          text-align: center;
        }

        body {
          display: none !important;
        }
      `;
    }

    await writeFile(outputFilePath, outputContent, {encoding: 'utf8'});

    const size = (new Blob([outputContent]).size / 1024).toFixed(1);
    logger.logOther?.(`📦 ${outputFilePath} ${size}kb`);
  }

  const endTime = Date.now();
  logger.logOther?.(`PostCSS build done in ${endTime - startTime}ms`);
}
