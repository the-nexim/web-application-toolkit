import {writeFile} from 'fs/promises';
import {env} from 'process';

import {generateSW} from 'workbox-build';

import {logger} from './logger.mjs';

const deploymentServiceWorkerContent = "console.log('service worker not build in deployment.')";
const serviceWorkerDest = 'dist/service-worker.js';

export function generateServiceWorker() {
  if (env.NODE_ENV !== 'production') {
    logger.logMethodArgs?.('generateServiceWorker', {mode: 'deployment'});
    return writeFile(serviceWorkerDest, deploymentServiceWorkerContent);
  }

  logger.logMethodArgs?.('generateServiceWorker', {mode: 'production'});
  return generateSW({
    globDirectory: 'dist',
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
}
