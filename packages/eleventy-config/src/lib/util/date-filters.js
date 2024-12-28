const defaultLocale = 'fa-IR';

/**
 * Formats a date according to the specified locale and options.
 *
 * @param {string | number | Date} date - The date to format.
 * @param {string} [locale=defaultLocale] - The locale to use for formatting.
 * @param {Intl.DateTimeFormatOptions} [options={ month: 'long', day: 'numeric' }] - The options for formatting.
 * @returns {string} - The formatted date string.
 */
export function dateString(date, locale = defaultLocale, options = {month: 'long', day: 'numeric'}) {
  return new Date(date).toLocaleDateString(locale, options);
}

/**
 * Formats a time according to the specified locale and options.
 *
 * @param {string | number | Date} time - The time to format.
 * @param {string} [locale=defaultLocale] - The locale to use for formatting.
 * @param {Intl.DateTimeFormatOptions} [options={ hour: 'numeric', minute: 'numeric' }] - The options for formatting.
 * @returns {string} - The formatted time string.
 */
export function timeString(time, locale = defaultLocale, options = {hour: 'numeric', minute: 'numeric'}) {
  return new Date(time).toLocaleTimeString(locale, options);
}
