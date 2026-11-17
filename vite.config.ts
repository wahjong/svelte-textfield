import fs from 'fs';
import os from 'os';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import checker from 'vite-plugin-checker';
import svgLoader from 'vite-svg-loader';
import { visualizer } from "rollup-plugin-visualizer";

function getLocalIp() {
    for (const addresses of Object.values(os.networkInterfaces())) {
        for (const add of addresses!) {
            if (add.address.startsWith('10.') || add.address.startsWith('192.')) {
                return add.address;
            }
        }
    }
}

const eth1 = getLocalIp();

const usesourcemap = true;

const production = process.env.NODE_ENV === 'production';

export default defineConfig({

    plugins: [
        svelte(),

        svgLoader({
            defaultImport: 'raw',
        }),

        checker({
            typescript: false,
        }),

        visualizer({
            template: 'treemap',
            gzipSize: true,
        }),
    ],

    css: {
        devSourcemap: true,
    },

    resolve: {
        alias: {
        },
    },

    server: {
        host: eth1,
        https: {
            key: fs.readFileSync(`./server/${eth1}.key`, 'utf8'),
            cert: fs.readFileSync(`./server/${eth1}.crt`, 'utf8'),
        },
    },

    build: {
        cssCodeSplit: false,

        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false,
            }
        },

        outDir: './html',
        sourcemap: usesourcemap,
        copyPublicDir: false,
        emptyOutDir: false,

        rolldownOptions: {
            external: [
            ],

            input: {
                'textfield': 'src/TextField.ts',
            },

            output: {
                format: 'iife',
                assetFileNames: 'dist/TextField.[ext]',
                entryFileNames: 'dist/[name].js',
                globals: {},
            },

        },
    }
});
