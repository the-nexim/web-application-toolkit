import {createLogger} from '@alwatr/logger';

export const logger = /* @__PURE__ */ createLogger(__package_name__);

/**
 * Compares two version strings to determine if the current version is larger than the other version.
 *
 * @param {string} currentVersion - The current version string in the format 'x.y.z'.
 * @param {string} otherVersion - The other version string to compare against in the format 'x.y.z'.
 * @returns {boolean} True if the current version is larger, false otherwise.
 *
 * @example
 * const isLarger = isVersionLarger('1.2.3', '1.2.2'); // returns true
 */
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
