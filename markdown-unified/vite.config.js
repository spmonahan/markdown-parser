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
        'markdown-unified-stream-ux-webworker': resolve(__dirname, 'markdown-unified-stream-ux-webworker.js'),
        'worker': resolve(__dirname, 'worker.js'),
        'worker-stream': resolve(__dirname, 'worker-stream.js'),
        'worker-ux-stream': resolve(__dirname, 'worker-ux-stream.js'),
      },
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});