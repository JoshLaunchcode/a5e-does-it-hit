import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

const path = require('path');

const config = {
	root: 'src/',
	base: '/modules/does-it-hit-a5e/',
	publicDir: path.resolve(__dirname, 'public'),
	server: {
		port: 30001,
		open: '/game',
		proxy: {
			'^(?!/modules/does-it-hit-a5e/)': 'http://localhost:30000',
			'/socket.io': {
				target: 'ws://localhost:30000',
				ws: true,
			},
		},
	},
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		emptyOutDir: true,
		sourcemap: true,
		brotliSize: true,
		lib: {
			name: 'Does it Hit?! (A5E)',
			entry: path.resolve(__dirname, 'src/index.js'),
			formats: ['es'],
			fileName: () => 'index.js',
		},
	},
	plugins: [
		svelte({
			preprocess: preprocess(),
			onwarn: (warning, handler) => {
				// Suppress `a11y-missing-attribute` for missing href in <a> links.
				// Foundry doesn't follow accessibility rules.
				if (
					warning.message.includes('<a> element should have an href attribute')
				) {
					return;
				}

				// Let Rollup handle all other warnings normally.
				handler(warning);
			},
		}),
	],
};

export default config;
