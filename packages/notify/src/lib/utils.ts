import {localJsonStorage} from '@alwatr/local-storage';
import { random } from '@alwatr/math';
import {waitForAnimationFrame, waitForTimeout} from '@alwatr/wait';

import {logger} from './logger.js';

/**
 * Set `debug` to `1` if `debugMode` is `true` in debug mode
 */
export function devMode() {
  logger.logMethod?.('devMode');
  localStorage.setItem('ALWATR_DEBUG', '1');
  localStorage.setItem('debug', '1'); // old logger
  localStorage.setItem('alwatrDebug', '1'); // old logger
  location.reload();
}

/**
 * Get device id.
 *
 * If not exists, generate a new one and save it.
 */
export function getDeviceId(): string {
  let {id: deviceId} = localJsonStorage.getItem<{id: string | null}>('device_id', {id: null}, 0);
  if (deviceId == null) {
    deviceId = random.uuid;
    localJsonStorage.setItem('device_id', {id: deviceId}, 0);
  }
  return deviceId;
}

export function isVersionLarger(currentVersion: string, otherVersion: string) {
  logger.logMethodArgs?.('isVersionLarger', {currentVersion, otherVersion});
  const current = currentVersion.split('.').map(Number);
  const other = otherVersion.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (current[i] > other[i]) return true;
    if (current[i] < other[i]) return false;
  }

  return false;
}


/**
 * Running code immediately after a repaint maximizes the chance that the DOM has been fully calculated.
 * This minimizes the chance that querying the DOM will cause a costly reflow.
 * If you're not querying the DOM, then this isn't something you need to worry about.
 *
 * `requestAnimationFrame` schedules code to run immediately before the repaint, which is close but not quite ideal.
 * Using `setTimeout` with a delay of 0 (or `setImmediate` on supported browsers) will execute code as soon as possible after that.
 * This approach doesn't guarantee that your code is the first to run after the repaint,
 * but it's the best you can do with the available APIs.
 *
 * @see https://stackoverflow.com/a/47184426
 */
export function waitForNextFrame(): Promise<void> {
  logger.logOther?.('waitForNextFrame');

  return new Promise((resolve) => {
    waitForAnimationFrame().then(() => {
      waitForTimeout(0).then(resolve);
    });
  });
}
