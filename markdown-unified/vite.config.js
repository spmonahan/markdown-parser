import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.{md,html}'],
  build: {
    rollupOptions: {
      input: {
        'markdown-unified': resolve(__dirname, 'markdown-unified.js'),
        'markdown-unified-webworker': resolve(__dirname, 'markdown-unified-webworker.js'),
        'worker': resolve(__dirname, 'worker.js'),
      },
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});