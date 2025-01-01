# @nexim/11ty-font

![NPM Version](https://img.shields.io/npm/v/@nexim/11ty-font)
![npm bundle size](https://img.shields.io/bundlephobia/min/@nexim/11ty-font)
![Build & Lint & Test](https://github.com/the-nexim/web-application-toolkit/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@nexim/11ty-font)
![NPM License](https://img.shields.io/npm/l/@nexim/11ty-font)

## Overview

An Eleventy tool for seamless font integration, supporting custom fonts from any npm packages with simple configuration.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/11ty-font

# Or using yarn
yarn add @nexim/11ty-font
```

## API

### 11ty-font

Create a directory for your selected font and paste the font files into it with logger.

```ts
import configFont from '@nexim/11ty-font';

await configFont({ fontName: 'google', outputDir: 'dist/font', })

```
