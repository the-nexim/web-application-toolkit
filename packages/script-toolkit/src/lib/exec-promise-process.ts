import {spawn} from 'node:child_process';

import {newFlatomise} from '@alwatr/flatomise';
import {chalk, spinner} from 'zx';

import {logger} from './logger.js';

export function execAsyncProcess(command: string, args: string[]): Promise<void> {
  logger.logStep?.('execAsyncProcess', chalk.green(`${command} ${args.join(' ')}`));

  const child = spawn(command, args, {stdio: 'pipe'});

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const flatomise = newFlatomise<void>();
  spinner(`Running...`, () => flatomise.promise);

  child.stdout.on('data', (data) => {
    process.stderr.write(data);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  child.on('error', flatomise.reject);

  child.on('close', (code) => {
    if (code === 0) {
      flatomise.resolve();
    }
    else {
      flatomise.reject(
        new Error(`exec ${command} failed with code ${code}`, {
          cause: {command, args},
        }),
      );
    }
  });

  return flatomise.promise;
}
