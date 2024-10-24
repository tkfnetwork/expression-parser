const esbuild = require('esbuild');
const rimraf = require('rimraf');

rimraf.sync('dist');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    outfile: 'dist/index.js',
    minify: true,
  })
  .catch(() => process.exit(1));
