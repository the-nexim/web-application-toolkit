import {writeFile} from 'fs/promises';

import {platformInfo} from '@alwatr/platform-info';
import {generateSW, type BuildResult} from 'workbox-build';

import {logger} from './logger.js';

const deploymentServiceWorkerContent = "console.log('service worker not build in deployment.')";
const serviceWorkerDest = 'dist/service-worker.js';

export async function generateServiceWorker(): Promise<BuildResult | null> {
  const isDevelopment = platformInfo.development === true;
  logger.logMethodArgs?.('generateServiceWorker', {isDevelopment});

  if (isDevelopment === true) {
    await writeFile(serviceWorkerDest, deploymentServiceWorkerContent);
    return null;
  }

  const buildResult = await generateSW({
    globDirectory: 'dist',
    maximumFileSizeToCacheInBytes: 1 * 1024 * 1024, // 1MB
    cleanupOutdatedCaches: true,
    inlineWorkboxRuntime: false,
    clientsClaim: true,
    skipWaiting: true,
    globPatterns: ['**/*.{woff,woff2,js,css,webmanifest,html}', 'index.html', 'favicon.ico'],
    swDest: serviceWorkerDest,
    sourcemap: false,
    mode: 'production',
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 2 * 30 * 24 * 60 * 60, // 2 Months
          },
        },
      },
      {
        urlPattern: /\.(?:m4a|mp3)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'sounds',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 2 * 30 * 24 * 60 * 60, // 2 Months
          },
        },
      },
      {
        urlPattern: /\.(?:js|css|json)(\?.*)?$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'resources',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 2 * 30 * 24 * 60 * 60, // 2 Months
          },
        },
      },
    ],
  });

  const preCacheSize = Math.floor(buildResult.size / 1024);
  logger.logOther?.(`Generated a service worker, which will pre-cache ${buildResult.count} files, totaling ${preCacheSize}kb.`);
  return buildResult;
}
