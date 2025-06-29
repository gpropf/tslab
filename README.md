# Tslab

This repository was originally meant to be a "laboratory" for me to try out TypeScript and the Vue framework. At the moment, there's really only one thing here which is a re-implementation of this app (https://gregorypropf.com/pixreact) located at my old portfolio site. I plan to rework the text on that page so it describes this app but until I do, you can pretty much understand this app by reading about its ancestor. One small improvement is that this implementation of the search-and-replace algorithm does not have the "subtle bug" I mentioned in the original docs. To put it simply, if a pattern is invariant under rotation (rotation angle doesn't matter) or partially degenerate (i.e. 0 and 180 degree rotations look the same) the correct behavior is to say that each occurrence of the pattern can be said to match at all the rotations that look identical. So a pattern like a simple horizontal line, which looks the same rotated by 0 or 180 degrees but not 90 or 270 degrees, should be flagged as matching _both_ the 0 and 180 degree rotated form or _both_ the 90 and 270 degree form. Why does this matter? It matters if the successor pattern does not have the same rotational symmetry. Imagine a simple cross pattern (looks the same at all rotations) that has a thing that looks like the letter "L" as successor. The correct match and replace operation will superimpose 4 of the L patterns rotated at 0,90,180, and 270 degrees. The original app doesn't handle this correctly. This one does. Aren't you happy?

## Todo

Somewhat related to the rotation issues above, this app really needs a way for the user to change the priority weights applied to the successors of different rotations of predecessor patterns. There's a static map at line 82 in `PixelReactor.ts` called `transformToPriorityOffsetMap` that defines these weights. They should be user definable instead.

## What follows is mostly the boilerplate Vue created.

---

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Misc

This regex string finds TS functions in VScode "[a-z0-9_]+\(.[a-z0-9_ :]+\)". At the command line you can use `grep "[A-Za-z0-9_]\+([A-Za-z0-9_ ,:]*):\?.*\s*{" PixelReactor.ts`. This allows you to count functions and methods. I use this to locate functions to make sure I've commented them all or get a handle on which ones I haven't documented properly.
