# @nexim/eleventy-config

![NPM Version](https://img.shields.io/npm/v/%40nexim%2Eeleventy-config)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40nexim%2Eeleventy-config)
![Build & Lint & Test](https://github.com/the-nexim/web-application-toolkit/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/%40nexim%2Eeleventy-config)
![NPM License](https://img.shields.io/npm/l/%40nexim%2Eeleventy-config)

## Overview

An optimized, production-ready configuration for the [Eleventy](https://www.11ty.dev/) static site generator tailored for the [Nexim APP Template](https://github.com/the-nexim/nexim-app) structure. This setup ensures efficient Eleventy projects by integrating HTML minification, PostCSS processing, service worker generation, and other performance-focused enhancements for scalable and maintainable web applications.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/eleventy-config

# Or using yarn
yarn add @nexim/eleventy-config
```

## API

### eleventyConfiguration

Configures Eleventy with nexim app specification and html minify, postcss, workbox, etc.

```ts
import {eleventyConfiguration} from '@nexim/eleventy-config';

export default function (eleventyConfig) {
  return eleventyConfiguration(eleventyConfig);
}
```

> Returning the `eleventyConfiguration` function is necessary to ensure the configuration is applied to the Eleventy instance.

## TODO

- in the future, we will take the customization configuration from the User.
- Separate package for plugins.
