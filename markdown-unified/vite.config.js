import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.{md,html}'],
  build: {
    rollupOptions: {
      input: {
        'markdown-unified': resolve(__dirname, 'markdown-unified.js'),
        'markdown-unified-stream': resolve(__dirname, 'markdown-unified-stream.js'),
        'markdown-unified-webworker': resolve(__dirname, 'markdown-unified-webworker.js'),
        'markdown-unified-stream-webworker': resolve(__dirname, 'markdown-unified-stream-webworker.js'),
        'worker': resolve(__dirname, 'worker.js'),
        'worker-steam': resolve(__dirname, 'worker-steam.js'),
      },
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});