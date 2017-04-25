import {
  Injectable,
  Injector,
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

import {
  MockDirectiveResolver,
} from '@angular/compiler/testing';

let _outlivingCompiler: OutlivingTestingCompiler;

@Injectable()
export class OutlivingTestingCompiler extends JitCompiler {
  private _delegate: JitCompiler;
  private _overrideFlag: boolean;
  private _moduleResolver: NgModuleResolver;
  private _resultCache: Map<Type<any>, ModuleWithComponentFactories<any>>;
  private _cleanDependencies: {
    injector: Injector,
    metadataResolver: CompileMetadataResolver,
    templateParser: TemplateParser,
    styleCompiler: StyleCompiler,
    viewCompiler: ViewCompiler,
    ngModuleCompiler: NgModuleCompiler,
    compilerConfig: CompilerConfig,
  };

  static getInstance(): OutlivingTestingCompiler | undefined {
    return _outlivingCompiler;
  }

  static initialize(
    injector: Injector,
    metadataResolver: CompileMetadataResolver,
    templateParser: TemplateParser,
    styleCompiler: StyleCompiler,
    viewCompiler: ViewCompiler,
    ngModuleCompiler: NgModuleCompiler,
    compilerConfig: CompilerConfig,
    ngModuleResolver: NgModuleResolver,
    directiveResolver: DirectiveResolver,
  ): OutlivingTestingCompiler {
    _outlivingCompiler = new OutlivingTestingCompiler(
      injector, metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, compilerConfig, ngModuleResolver, directiveResolver,
    );
    return _outlivingCompiler;
  }

  protected constructor(
    _injector: Injector,
    _metadataResolver: CompileMetadataResolver,
    _templateParser: TemplateParser,
    _styleCompiler: StyleCompiler,
    _viewCompiler: ViewCompiler,
    _ngModuleCompiler: NgModuleCompiler,
    _compilerConfig: CompilerConfig,
    _ngModuleResolver: NgModuleResolver,
    _directiveResolver: DirectiveResolver,
  ) {
    super(_injector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _compilerConfig, console);
    this.setCleanDeps(_injector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _compilerConfig);
    this._moduleResolver = _ngModuleResolver;
    this._resultCache = new Map<Type<any>, ModuleWithComponentFactories<any>>();
    if (_directiveResolver instanceof MockDirectiveResolver) {
      this._decorateResolver(_directiveResolver, 'setDirective');
      this._decorateResolver(_directiveResolver, 'setInlineTemplate');
      this._decorateResolver(_directiveResolver, 'setProvidersOverride');
      this._decorateResolver(_directiveResolver, 'setView');
      this._decorateResolver(_directiveResolver, 'setViewProvidersOverride');
    }
  }

  setCleanDeps(
    injector: Injector,
    metadataResolver: CompileMetadataResolver,
    templateParser: TemplateParser,
    styleCompiler: StyleCompiler,
    viewCompiler: ViewCompiler,
    ngModuleCompiler: NgModuleCompiler,
    compilerConfig: CompilerConfig,
  ) {
    this._cleanDependencies = {
      injector, metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, compilerConfig
    };
  }

  compileModuleAndAllComponentsSync<T>(moduleType: Type<T>) {
    const key = this._checkCacheIsEnabled(moduleType);
    if (!key) {
      return this._getCleanCompiler().compileModuleAndAllComponentsSync(moduleType);
    }
    const hit = this._resultCache.get(key);
    if (!hit) {
      if (!this._delegate) {
        this._delegate = this._getCleanCompiler();
      }
      const result = this._delegate.compileModuleAndAllComponentsSync(moduleType);
      this._resultCache.set(key, result);
      return result;
    }  else {
      return hit;
    }
  }

  compileModuleAndAllComponentsAsync<T>(moduleType: Type<T>) {
    const key = this._checkCacheIsEnabled(moduleType);
    if (!key) {
      return this._getCleanCompiler().compileModuleAndAllComponentsAsync(moduleType);
    }
    const hit = this._resultCache.get(key);
    if (!hit) {
      if (!this._delegate) {
        this._delegate = this._getCleanCompiler();
      }
      return this._delegate.compileModuleAndAllComponentsAsync(moduleType).then(result => {
        this._resultCache.set(key, result);
        return result;
      });
    } else {
      return Promise.resolve<ModuleWithComponentFactories<T>>(hit);
    }
  }

  clearCache() {
    this._resultCache.clear();
    return this._delegate.clearCache();
  }

  private _checkCacheIsEnabled<T>(moduleType: Type<T>): Type<any> | null {
    // Note:
    // When orverriding via TestBed.overrid****, cache is no longer available.
    if (this._overrideFlag) {
      this._overrideFlag = false;
      return null;
    }

    // Note:
    // To avoid for the following compilation syntax error, we use Component declared in TestingModule as a key of cache.
    // > Type ${stringifyType(type)} is part of the declarations of 2 modules
    const ngModule = this._moduleResolver.resolve(moduleType);
    if (!ngModule.declarations || ngModule.declarations.length === 0) {
      return null;
    }
    if (ngModule.declarations.length > 1 || Array.isArray(ngModule.declarations[0])) {
      // FIXME 
      // How to create key when TestingModule has two or more declarations...?
      return null;
    }
    return ngModule.declarations[0] as Type<any>;
  }

  private _getCleanCompiler() {
    const {
      injector, metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, compilerConfig
    } = this._cleanDependencies;
    return new JitCompiler(injector, metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, compilerConfig, console);
  }

  private _decorateResolver(resolverDelegate: MockDirectiveResolver, name: keyof MockDirectiveResolver) {
    const orig = resolverDelegate[name] as Function, self = this;
    resolverDelegate[name] = function() {
      self._overrideFlag = true;
      return orig.apply(this, arguments);
    };
    return resolverDelegate;
  }
}
