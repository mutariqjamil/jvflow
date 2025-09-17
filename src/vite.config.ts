import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/styles': path.resolve(__dirname, './styles')
    }
  },
  build: {
    // Optimize for free tier hosting
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: [
            'lucide-react',
            'sonner',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          forms: [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          charts: ['recharts'],
          motion: ['motion']
        }
      }
    },
    // Optimize chunk size for free tier
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (can be disabled in production)
    sourcemap: process.env.NODE_ENV === 'development'
  },
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  },
  // Environment variables
  envPrefix: 'VITE_',
  // Optimize dependencies for faster builds
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'recharts',
      'react-hook-form'
    ]
  }
})