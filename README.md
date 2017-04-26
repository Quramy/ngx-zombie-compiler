# ngx-zombie-compiler
[![wercker status](https://app.wercker.com/status/5a0a95321e9f308a2e82388d339e4b16/s/master "wercker status")](https://app.wercker.com/project/byKey/5a0a95321e9f308a2e82388d339e4b16) [![npm version](https://badge.fury.io/js/ngx-zombie-compiler.svg)](https://badge.fury.io/js/ngx-zombie-compiler) [![dependencies Status](https://david-dm.org/quramy/ngx-zombie-compiler/status.svg)](https://david-dm.org/quramy/ngx-zombie-compiler) [![Greenkeeper badge](https://badges.greenkeeper.io/Quramy/ngx-zombie-compiler.svg)](https://greenkeeper.io/) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Quramy/ngx-zombie-compiler/master/LICENSE)

Fast JiT compiler for Angular unit testing.

## Install

```sh
npm install ngx-zombie-compiler -D
```

or 

```sh
yarn add ngx-zombie-compiler -D
```

## Usage

To use the compiler provided by this module, you need to configure it using `TestBed.configureCompiler`. If you use angular-cli, you can edit `src/test.ts`.

```typescript
// First, import ZOMBIE_COMPILER_PROVIDERS
import { ZOMBIE_COMPILER_PROVIDERS } from 'ngx-zombie-compiler';

// :

// Second, configure TestBed's compiler
beforeEach(() => {
  getTestBed().configureCompiler({
    providers: ZOMBIE_COMPILER_PROVIDERS,
  });
});
```

## Why?
By the default, TestingCompiler provided by Angular compiles all modules by each spec and compiling modules makes your test heavy.
In mane cases, we can turn use the compiled result, so this module provide another JiT compiler which outlives default JiT compiler and reuses the compiled result. So using this, you can reduce the total execution time to run unit testing.

If you want details, please see [my gist](https://gist.github.com/Quramy/1dd5bed0bce1e7f34b79184453d1790f#configure-testbeds-compiler).

## License
MIT
