import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { teacherApiMockPlugin } from './vite.teacherApiMock';

export default defineConfig({
  plugins: [react(), teacherApiMockPlugin()],
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  worker: {
    format: 'es',
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
