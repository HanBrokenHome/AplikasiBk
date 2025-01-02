import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Ini memastikan asset menggunakan path relatif
  plugins: [react()],
});
