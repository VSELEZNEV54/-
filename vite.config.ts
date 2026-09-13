import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // База для GitHub Pages задаётся переменной VITE_BASE (например, '/-/'); локально остаётся '/'
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
