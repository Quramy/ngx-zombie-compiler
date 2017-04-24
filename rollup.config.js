export default {
  entry: 'build/es2015/ngx-zombie-compiler.js',
  dest: 'dist/ngx-zombie-compiler.js',
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
