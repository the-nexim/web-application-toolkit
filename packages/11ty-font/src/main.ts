import {mkdir, cp} from 'fs/promises';
import {dirname, join} from 'path';

import {createLogger} from '@alwatr/logger';
import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

const logger = createLogger(__package_name__);

export default async function copyFont({fontName, outputDir}: {fontName: string; outputDir: string}) {
  logger.logMethodArgs?.('copyFont(%s)', fontName);

  const outDir = join(outputDir!, 'font', fontName);
  await mkdir(outDir, {recursive: true});

  let fontPath = require.resolve('@alwatr/font');
  fontPath = dirname(fontPath);
  fontPath = join(fontPath, fontName);

  logger.logMethodArgs?.('copyFont(%s)', fontName);

  await cp(fontPath, outDir, {recursive: true, preserveTimestamps: true, force: true});
}
