import { URL } from 'url';
import { defineConfig } from 'vite';

import wpm from './scripts/wpm.mjs';

export default defineConfig(({ mode }) => {
  const root = new URL('./src', import.meta.url).pathname;
  const outDir = new URL('./dist', import.meta.url).pathname;

  const input = wpm(root, {
    staticDirs: ['_locales', 'assets', 'vendor/@whotracksme/ui/src/images'],
    outDir,
    target: mode,
  });

  return {
    root,
    plugins: [
      {
        name: 'clean-build',
        enforce: 'pre',
        options: (options) => {
          options.plugins = options.plugins.filter(
            (p) => p.name !== 'vite:build-import-analysis',
          );
          return options;
        },
        generateBundle(options, bundle) {
          Object.values(bundle).forEach((chunk) => {
            if (
              chunk.type === 'chunk' &&
              !chunk.isEntry &&
              !chunk.facadeModuleId.endsWith('.html') &&
              chunk.imports &&
              chunk.imports.length
            ) {
              chunk.imports = [];
            }
          });
        },
      },
    ],
    resolve: {
      alias: [{ find: '/hybrids.js', replacement: 'hybrids' }],
    },
    build: {
      outDir,
      emptyOutDir: false,
      minify: false,
      polyfillModulePreload: false,
      target: 'esnext',
      rollupOptions: {
        input,
        preserveEntrySignatures: 'exports-only',
        output: {
          dir: outDir,
          manualChunks: false,
          preserveModules: true,
          preserveModulesRoot: 'src',
          minifyInternalExports: false,
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.facadeModuleId.endsWith('.css')) {
              return 'common/[name].css';
            }
            if (chunkInfo.isEntry) {
              return chunkInfo.facadeModuleId.replace(/^.*\//, '');
            }
            return '[name].js';
          },
          chunkFileNames: 'common/[name].js',
          assetFileNames: (chunkInfo) =>
            chunkInfo.name.includes('/') && chunkInfo.name.endsWith('.css')
              ? chunkInfo.name.replace('.css', '')
              : 'common/[name].[ext]',
        },
      },
    },
  };
});
