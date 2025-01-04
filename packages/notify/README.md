# @nexim/snackbar

Snackbar component with signal capability.

![NPM Version](https://img.shields.io/npm/v/@nexim/snackbar)
![npm bundle size](https://img.shields.io/bundlephobia/min/@nexim/snackbar)
![Build & Lint & Test](https://github.com/the-nexim/design-system/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@nexim/snackbar)
![NPM License](https://img.shields.io/npm/l/@nexim/snackbar)

## Overview

Snackbar component. It includes utilities for managing the snackbar's state and animations.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/snackbar

# Or using yarn
yarn add @nexim/snackbar
```

## API

### snackbarSignal

To display a snackbar, emit the snackbarSignal with the desired options:

```ts
import {snackbarSignal} from '@nexim/snackbar';

snackbarSignal.notify({
  content: 'This is a snackbar message',
  // The following properties are optional.
  action: {
    label: 'Undo',
    signalId: 'undo-handler',
  },
  duration: '5s',
  addCloseButton: true,
});
```
