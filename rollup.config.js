import svelte from 'rollup-plugin-svelte';
//import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

/*
* With this, 'npm run dev' serves the files while 'rollup -c -w' watches for changes and recompiles. The other option
* would be to use eg. 'concurrently' and 'wait-on' npm modules that are now not needed.
*
* Note: Different to Svelte template's code, the command has been lifted upper from the midst of code, and we call
* 		'sirv' directly (instead of 'npm run start --dev'). This causes slight duplication but also keeps 'dev' separate
* 		from other npm targets (and is simpler).
*/
function serve() {
	const cmd = "sirv --host 0.0.0.0 public --dev --no-clear".split(' ')
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn(cmd[0], cmd.slice(1), {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		// Two rounds of Svelte - see -> https://github.com/sveltejs/svelte/issues/4228#issuecomment-626315086
		//
		svelte({		// web components
			include: /\/[a-z][^/]+\.svelte$/,
			compilerOptions: {
				dev: !production,
				customElement: true,
			}
		}),
		svelte({		// normal Svelte classes
			include: /\/[A-Z][^/]+\.svelte$/,
			compilerOptions: {
				dev: !production,
				customElement: false,
			}
		}),

		css(),
    image({
      dom: true
    }),

		resolve({
			modulesOnly: true,
			//browser: true,		// keep disabled
			//dedupe: ['svelte']
		}),
		//commonjs(),

		!production && serve(),		// serve 'public'
		!production && livereload('public'),

		// If building for production ('npm run build'), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
