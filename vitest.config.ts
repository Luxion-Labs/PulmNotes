import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.next', 'src-tauri'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/editor': path.resolve(__dirname, './editor'),
      '@/components': path.resolve(__dirname, './app/components'),
      '@/app': path.resolve(__dirname, './app'),
    },
  },
})
