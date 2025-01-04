import {l10n} from '@alwatr/i18n';
import { serviceWorkerSignal } from '@nexim/service-worker';

import {logger} from './logger.js';
import {snackbarSignal} from './signal.js';
import {isVersionLarger} from './utils.js';

const notifyLocalStorageKey = 'notify_new_version';

export function serviceWorkerNotifyHandler(options: {lastNotifyVersion: string; changelogPage?: string}): void {
  logger.logMethodArgs?.('serviceWorkerNotifyHandler', {options});

  serviceWorkerSignal.subscribe(({event}) => {
    logger.logProperty?.('serviceWorkerSignal.event', {event});

    if (event === 'service_worker_update_found') {
      snackbarSignal.notify({
        content: 'در حال به‌روزرسانی برنامه...',
        duration: -1,
      });
    }
    else if (event === 'service_worker_first_install') {
      // nothing for better UX
      return;
    }
    else if (event === 'service_worker_registered') {
      const lastVersion = localStorage.getItem(notifyLocalStorageKey);
      if (lastVersion !== null) {
        localStorage.removeItem(notifyLocalStorageKey);
        const message = `به نسخه ${l10n.replaceNumber(__package_version__.replace('-alpha', '-آلفا'))} خوش‌آمدید.`;

        if (
          (options.changelogPage != null && options.lastNotifyVersion === __package_version__) ||
          lastVersion === '' ||
          isVersionLarger(options.lastNotifyVersion, lastVersion)
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
    else if (event === 'service_worker_installed') {
      snackbarSignal.notify({
        content: 'برنامه نصب شد و اکنون به صورت آفلاین در دسترس است.',
      });
    }
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
