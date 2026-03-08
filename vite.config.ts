import { defineConfig } from 'vite';
import preloadPlugin from 'vite-preload/plugin';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    server: {
        watch: { usePolling: false },
        allowedHosts: true,
    },
    base: "/crowds/",
    plugins: [
        preloadPlugin(),
        wasm()
    ],
});