import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


import dotenv from 'dotenv';
dotenv.config();


const port: number = parseInt(process.env.VITE_PORT || "3000", 10);


export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: port,
    strictPort: true,
  },
  server: {
    port: port,
    strictPort: true,
    host: "0.0.0.0",
    // origin: `http://0.0.0.0:${port}`,
  },
});