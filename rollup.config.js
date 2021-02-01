import svelte from 'rollup-plugin-svelte';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

import { spawn } from 'child_process'
import { writeFileSync } from 'fs'

const devNull = '/dev/null';    // needs changing on Windows

// HACK
// Create '.hack.js' for the Rollup serving target (it cannot take 'input: '/dev/null'').
//
const hackJs = ".hack.js";
if (!production) {
  writeFileSync(hackJs, "/* Empty source to please Rollup serve target. */\n" );
}

/*
* With this, 'npm run dev' serves the files while 'rollup -c -w' watches for changes and recompiles. The other option
* would be to use eg. 'concurrently' and 'wait-on' npm modules that are now not needed.
*
* Note: Different to Svelte template's code, the command has been lifted upper from the midst of code, and we call
* 		'sirv' directly (instead of 'npm run start --dev'). This causes slight duplication but also keeps 'dev' separate
* 		from other npm targets (and is simpler).
*/
function serve() {
	const cmd = "sirv --host 0.0.0.0 demo --dev --no-clear".split(' ')
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn(cmd[0], cmd.slice(1), {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

// Create separate bundles for each component.
//
function gen(name) {
  const ret = {
    input: `packages/${name}/src/index.svelte`,
    output: {
      sourcemap: true,
      format: 'es',
      file: `packages/${name}/dist/bundle.js`
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
      svelte({		// Svelte (sub)components
        include: /\/[A-Z][^/]+\.svelte$/,
        compilerOptions: {
          dev: !production,
          customElement: false,
        }
      }),

      // Svelte places CSS is separate files, by default (which is good; we just need to provide a plugin to handle
      // the dishes).
      //
      css({
        // Without specified output, 'rollup-plugin-css-only' creates either 'bundle.css' (if 'output.dir' was used)
        // or 'dist/dist/{name}.css' (if 'file: dist/${name}' was used). Let's be specific.
        //output: `${name}.css`
        output: 'bundle.css'
      }),

      resolve({
        modulesOnly: true,
        //browser: true,		// keep disabled
        //dedupe: ['svelte']
      }),
      //commonjs(),

      // If building for production ('npm run build'), minify
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  };

  return ret;
}

export default [
  gen('aside-keys'),

  // Separate target for running the server.
  ...( !production ? [{
    input: hackJs,   // Rollup requires this field; couldn't resolve '/dev/null'.
    output: {
      sourcemap: false,
      file: devNull
    },
    plugins: [
      serve(),
      livereload('demo')
    ]
  }] : [])
];
