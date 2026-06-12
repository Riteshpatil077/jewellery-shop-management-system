import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.png'],
            manifest: {
                name: 'श्री कृष्णा ज्वेलर्स',
                short_name: 'RPJ ज्वेलर्स',
                description: 'श्री कृष्णा ज्वेलर्स - दुकान व्यवस्थापन प्रणाली',
                theme_color: '#1E3A8A',
                background_color: '#f8fafc',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-recharts': ['recharts'],
                    'vendor-lucide': ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        cssCodeSplit: true,
    },
    esbuild: {
        drop: ['console', 'debugger'],
    },
})
