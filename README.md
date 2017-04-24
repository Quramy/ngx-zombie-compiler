# ngx-zombie-compiler

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

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Second, configure TestBed's compiler
beforeEach(() => {
  getTestBed().configureCompiler({
    providers: ZOMBIE_COMPILER_PROVIDERS,
  });
});
```

## Why?
By the default, TestingCompiler provided by Angular compiles all modules by each spec and compiling modules makes your test heavy.
In most cases, we can turn use the compiled result, so this module provide another JiT compiler which outlives default JiT compiler.

## License
MIT
