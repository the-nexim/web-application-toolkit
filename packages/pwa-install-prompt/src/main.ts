import {createLogger} from '@alwatr/logger';
import {packageTracer} from '@alwatr/package-tracer';
import {parseDuration} from '@alwatr/parse-duration';
import {waitForTimeout} from '@alwatr/wait';
import {snackbarSignal} from '@nexim/snackbar';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

const logger = /* @__PURE__ */ createLogger(__package_name__);

/**
 * Check Is on installed PWA mode.
 */
function isOnInstalledPwa(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && window.navigator.standalone != null)
  );
}

/**
 * Check browser compatibility for PWA installation and setup the installation prompt handler.
 *
 * If browser support `BeforeInstallPromptEvent` event, show the install button and handle the installation process.
 *
 * @param installPwaPromptButton - The element to show the install prompt.
 */
export function setupInstallPwaPromptHandler(installPwaPromptButton: HTMLElement): void {
  logger.logMethod?.('setupInstallPwaPromptHandler');

  if (isOnInstalledPwa() === true) return;

  const isSupportInstallFromApp = 'BeforeInstallPromptEvent' in window;
  if (isSupportInstallFromApp === false) return;

  if (installPwaPromptButton === null) return;

  // Show button prompt because supported.
  installPwaPromptButton.style.display = 'flex';

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    installPwaPromptButton.addEventListener('click', () => {
      if (deferredPrompt == null) {
        logger.error('setupInstallPwaPromptHandler', 'deferred_prompt_is_null');
        snackbarSignal.notify({
          content: 'مشکلی در نصب برنامه پیش آمده است! ممکن است برنامه را قبلا نصب کرده باشید.',
          duration: parseDuration('2s'),
        });
        waitForTimeout(parseDuration('3s')).then(() => {
          location.href = '/';
        });
        return;
      }

      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    });

    // FIXME: check this to ensure work fine
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      snackbarSignal.notify({
        content: 'مراحل نصب آغاز شد...',
      });

      installPwaPromptButton.style.display = 'none';
    });
  }
  catch (error) {
    logger.error('setupInstallPwaPromptHandler', 'unknown_install_error', {error});
    snackbarSignal.notify({
      content: 'مشکلی در نصب برنامه پیش آمده است! ممکن است برنامه را قبلا نصب کرده باشید.',
    });
  }
}
