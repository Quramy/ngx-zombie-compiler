export default {
  entry: 'build/es5/ngx-zombie-compiler.js',
  dest: 'dist/ngx-zombie-compiler.es5.js',
  sourceMap: true,
  exports: 'named',
  moduleName: 'ngx-zombie-compiler',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/core/testing': 'ng.core.testing',
    '@angular/compiler': 'ng.compiler',
    '@angular/compiler/testing': 'ng.compiler.testing'
  }
};
