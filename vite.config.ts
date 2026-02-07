import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Serves mock GET /api/profile in development when no backend is running. */
function devMockProfileApi() {
  const mockPath = path.join(__dirname, 'scripts', 'mocks', 'profile.json');
  return {
    name: 'dev-mock-profile-api',
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req: { url?: string; method?: string }, res: { setHeader: (k: string, v: string) => void; statusCode: number; end: (s: string) => void }, next: () => void) => {
        const pathname = req.url?.split('?')[0];
        if (pathname === '/api/profile' && req.method === 'GET') {
          try {
            const data = fs.readFileSync(mockPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(data);
          } catch {
            next();
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devMockProfileApi()],
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/routes.ts',
      ],
      thresholds: {
        lines: Number(process.env.COVERAGE_LINES) || 70,
        functions: Number(process.env.COVERAGE_FUNCTIONS) || 70,
        branches: Number(process.env.COVERAGE_BRANCHES) || 70,
        statements: Number(process.env.COVERAGE_STATEMENTS) || 70,
      },
    },
  },
});
