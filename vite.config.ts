import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Assicura che i percorsi siano relativi per il deploy
  // Rimosso publicDir: usa la cartella standard 'public'
});