# @nexim/pwa-install-prompt

![NPM Version](https://img.shields.io/npm/v/@nexim/pwa-install-prompt)
![Build & Lint & Test](https://github.com/the-nexim/pwa-install-prompt/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@nexim/pwa-install-prompt)
![NPM License](https://img.shields.io/npm/l/@nexim/pwa-install-prompt)

## Overview

PWA install prompt handler.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/pwa-install-prompt

# Or using yarn
yarn add @nexim/pwa-install-prompt
```

## API

```ts
import {setupInstallPwaPromptHandler} from '@nexim/pwa-install-prompt';

setupInstallPwaPromptHandler(document.getElementById('install-pwa-guide'));
```
