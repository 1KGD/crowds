import { defineConfig } from 'vite';
import preloadPlugin from 'vite-preload/plugin';
import config from './config';

export default defineConfig({
    server: {
        watch: { usePolling: false },
        allowedHosts: true,
    },
    plugins: [
        preloadPlugin()
    ],
});