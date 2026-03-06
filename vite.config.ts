import { defineConfig } from 'vite';
import preloadPlugin from 'vite-preload/plugin';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    server: {
        watch: { usePolling: false },
        allowedHosts: true,
    },
    plugins: [
        preloadPlugin(),
        wasm()
    ],
});