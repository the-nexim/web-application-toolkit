# @nexim/toolkit

![NPM Version](https://img.shields.io/npm/v/@nexim/service-worker-notify)
![npm bundle size](https://img.shields.io/bundlephobia/min/@nexim/service-worker-notify)
![Build & Lint & Test](https://github.com/the-nexim/web-app-toolkit/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@nexim/service-worker-notify)
![NPM License](https://img.shields.io/npm/l/@nexim/service-worker-notify)

## Overview

Handles service worker notifications and displays snackbar messages with our without Close Button.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/service-worker-notify

# Or using yarn
yarn add @nexim/service-worker-notify
```

## API

### serviceWorkerNotifySnackbar

Handles service worker notifications and displays a snackbar message with or without a close button.

```ts
import {serviceWorkerNotifySnackbar} from '@nexim/service-worker-notify';

serviceWorkerNotifyHandler({
  lastNotifyVersion,
  changelogPage: 'https://example.com/changelog' || '/changelog/'
});
```
