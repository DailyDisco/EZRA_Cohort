import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: ['frontend-production-aa55.up.railway.app'],
    },
    build: {
        // Optimize chunks for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['antd', '@ant-design/icons'],
                    router: ['react-router', 'react-router-dom'],
                    auth: ['@clerk/react-router'],
                    utils: ['axios', '@tanstack/react-query'],
                },
            },
        },
        // Enable compression and minification with esbuild
        minify: 'esbuild',
        esbuild: {
            drop: ['console', 'debugger'],
            legalComments: 'none',
        },
        // Generate sourcemaps for production debugging
        sourcemap: true,
        // Reduce bundle size warnings
        reportCompressedSize: false,
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
    },
});
