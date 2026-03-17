import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    server: {
        watch: { usePolling: false },
        allowedHosts: true,
    },
    base: "/crowds/",
    plugins: [
        wasm()
    ],
});