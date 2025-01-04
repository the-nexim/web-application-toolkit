import {l10n} from '@alwatr/i18n';
import {serviceWorkerSignal} from '@nexim/service-worker';
import {snackbarSignal} from '@nexim/snackbar';

import {logger, isVersionLarger} from './toolkit.js';

const notifyLocalStorageKey = 'notify_new_version';

/**
 * Handles service worker notifications and displays a snackbar message with our without close button.
 *
 * @param {Object} options - The options for the notification.
 * @param {string} options.lastNotifyVersion - The last notified version of the application.
 * @param {string} [options.changelogPage] - The URL of the changelog page.
 *
 * @example
 * serviceWorkerNotifySnackbar({
 *   lastNotifyVersion: '1.0.0',
 *   changelogPage: 'https://example.com/changelog'
 * });
 */
export function serviceWorkerNotifySnackbar(options: {lastNotifyVersion: string; changelogPage?: string}): void {
  logger.logMethodArgs?.('serviceWorkerNotifyHandler', {options});

  serviceWorkerSignal.subscribe(({event}) => {
    logger.logProperty?.('serviceWorkerSignal.event', {event});

    /**
     * Handles the 'service_worker_update_found' event.
     * Displays a snackbar notification indicating the app is updating.
     */
    if (event === 'service_worker_update_found') {
      snackbarSignal.notify({
        content: 'در حال به‌روزرسانی برنامه...',
        duration: -1,
      });
    }
    /**
     * Handles the 'service_worker_first_install' event.
     * No action is taken for better UX.
     */
    else if (event === 'service_worker_first_install') {
      // nothing for better UX
      return;
    }
    /**
     * Handles the 'service_worker_registered' event.
     * Displays a welcome message if the version is new or updated.
     */
    else if (event === 'service_worker_registered') {
      const lastLocalVersion = localStorage.getItem(notifyLocalStorageKey);
      if (lastLocalVersion !== null) {
        localStorage.removeItem(notifyLocalStorageKey);
        const message = `به نسخه ${l10n.replaceNumber(__package_version__.replace('-alpha', '-آلفا'))} خوش‌آمدید.`;

        /**
         * Handles the display of a snackbar notification based on the service worker event.
         * If the changelog page is provided and the last notified version matches the current version,
         * or if the last local version is empty or older, it shows a snackbar with an action to view changes.
         * Otherwise, it shows a snackbar with a close button.
         */
        if (
          (options.changelogPage != null && options.lastNotifyVersion === __package_version__) ||
          lastLocalVersion === '' ||
          isVersionLarger(options.lastNotifyVersion, lastLocalVersion)
        ) {
          snackbarSignal.notify({
            content: message,
            duration: -1,
            addCloseButton: true,
            action: {
              label: 'مشاهده‌ی تغیرات',
              handler: () => {
                if (location.href === options.changelogPage!) location.reload();
                else location.href = options.changelogPage!;
              },
            },
          });
        }
        else {
          snackbarSignal.notify({
            content: message,
            duration: -1,
            addCloseButton: true,
          });
        }
      }
    }
    /**
     * Handles the 'service_worker_installed' event.
     * Displays a snackbar notification indicating the app is now available offline.
     */
    else if (event === 'service_worker_installed') {
      snackbarSignal.notify({
        content: 'برنامه نصب شد و اکنون به صورت آفلاین در دسترس است.',
      });
    }
    /**
     * Handles the 'service_worker_updated' event.
     * Displays a snackbar notification indicating the update is complete and provides a reload action.
     */
    else if (event === 'service_worker_updated') {
      localStorage.setItem(notifyLocalStorageKey, __package_version__);
      snackbarSignal.notify({
        content: 'به روز رسانی انجام شد.',
        duration: -1,
        action: {
          label: 'بارگذاری مجدد',
          handler: () => window.location.reload(),
        },
      });
    }
  });
}
