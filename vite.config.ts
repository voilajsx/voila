import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Root and entry point
  root: './src/web',
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    proxy: {
      // Proxy API calls to backend server
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      // Proxy health check to backend
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: '../../dist/web', // Output to project root dist/web
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development'
    // Remove rollupOptions.input - let Vite auto-discover index.html
  },
  
  // Path resolution for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@web': path.resolve(__dirname, './src/web'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@api': path.resolve(__dirname, './src/api')
    }
  },
  
  // Environment variables available in client
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  }
});