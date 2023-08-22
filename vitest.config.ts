import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            setupFiles: ['./test-setup/test-setup.ts'],
            // alias: [{ find: /^d3-time-format$/, replacement: '@visx/scale/esm/index.js' }]
        },
    }),
);
