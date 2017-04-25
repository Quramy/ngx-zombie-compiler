import {
  Injectable,
  Injector,
  Provider,
  FactoryProvider,
  Type,
  ModuleWithComponentFactories,
} from '@angular/core';

import {
  JitCompiler,
  TemplateParser,
  CompileMetadataResolver,
  CompilerConfig,
  ViewCompiler,
  NgModuleResolver,
  NgModuleCompiler,
  StyleCompiler,
  DirectiveResolver,
} from '@angular/compiler';

import { OutlivingTestingCompiler } from './compiler/outliving-testing-compiler';

export function zombieCompilerFactory (
  injector: Injector,
  metadataResolver: CompileMetadataResolver,
  templateParser: TemplateParser,
  styleCompiler: StyleCompiler,
  viewCompiler: ViewCompiler,
  ngModuleCompiler: NgModuleCompiler,
  compilerConfig: CompilerConfig,
  ngModuleResolver: NgModuleResolver,
  directiveResolver: DirectiveResolver,
) {
  const compiler = OutlivingTestingCompiler.getInstance();
  if (!compiler) {
    return OutlivingTestingCompiler.initialize(
      injector, metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, compilerConfig, ngModuleResolver, directiveResolver,
    );
  } else {
    compiler.setCleanDeps(injector, metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, compilerConfig);
    return compiler;
  }
}

/**
 *
 * This provides a Singleton JiTComponent, which not initialized when jasmine `beforeEach` fn.
 * So, using this compiler, we can run test specs with an 'outliving' compiler cache(modules, components, templates, ...).
 *
 **/
export const ZombieCompilerProvider: FactoryProvider = {
  provide: JitCompiler,
  useFactory: zombieCompilerFactory,
  deps: [
    Injector,
    CompileMetadataResolver,
    TemplateParser,
    StyleCompiler,
    ViewCompiler,
    NgModuleCompiler,
    CompilerConfig,
    NgModuleResolver,
    DirectiveResolver,
  ],
};

export const ZOMBIE_COMPILER_PROVIDERS: Provider[] = [
  ZombieCompilerProvider,
];
