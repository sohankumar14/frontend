import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Custom port
    open: true, // Automatically opens the app in the default browser
  },
  resolve: {
    alias: {
      '@': '/src', // Shortcut for easier imports
    },
  },
});
