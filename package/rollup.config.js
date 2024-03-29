import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import bundleSize from 'rollup-plugin-bundle-size';

const build = !process.env.ROLLUP_WATCH;

// #hack to mitigate a warning that Svelte plugin shouldn't give
//
// ... tbd. report to Svelte Plugin -> https://github.com/sveltejs/rollup-plugin-svelte/issues
//
function isUnnecessaryModuleReactivityWarning({ code, message}) {
  return (code === 'module-script-reactive-declaration' &&
    message === '"init" is declared in a module script and will not be reactive'
  );
}

function isPassableCssWarning({ code, message }) {
  return (code === 'css-unused-selector' &&
    message === 'Unused CSS selector ".pressed"'
  );
}

export default {
  input: 'src/index.wc.svelte',
  output: {
    sourcemap: true,
    format: 'es',
    file: 'dist/bundle.js'
  },
  external: [
    /^@?firebase\//,   // leave out 'firebase/' and '@firebase/' namespaces (and also 'tslib')
  ],
  /* for debugging
  external: (id) => {
    console.log(`External? ${id}`);

    if (id.startsWith('@firebase/') || id.startsWith('firebase/')) {
      return true;
    } else {
      return false;
    }
  },*/
  plugins: [
    // Two rounds of Svelte - see -> https://github.com/sveltejs/svelte/issues/4228#issuecomment-626315086
    //
    svelte({		// compile as web component ('...-component.wc.svelte')
      include: /.+\.wc\.svelte$/,
      compilerOptions: {
        dev: !build,
        customElement: true,
      },
      onwarn: (warning, handler) => {
        if (isUnnecessaryModuleReactivityWarning(warning)) return;
        handler(warning);
      }
    }),
    svelte({		// Svelte (sub)components ('MyComponent.svelte' or 'MyComponent/index.svelte')
      include: /\/[A-Z][^/]+(?:\/index)?\.svelte$/,
      compilerOptions: {
        dev: !build,
        customElement: false,
      },
      // Let come CSS selectors pass.
      onwarn: (warning, handler) => {
        if (isPassableCssWarning(warning)) return;
        handler(warning);
      }
    }),

    // Svelte places CSS is separate files, by default (which is good; we just need to provide a plugin to handle
    // the dishes).
    //
    css({
      // Svelte note: without specifying '.output', we get 'dist/dist/bundle.css' which is hardly a good default.
      //    (note: no-one would know, this is just aesthetics; the application doesn't need to read this file).
      //
      output: 'bundle.css'
    }),

    resolve({
      modulesOnly: true,
      //browser: true,		// keep disabled
      //dedupe: ['svelte']
    }),

    build && terser(),
    build && bundleSize()
  ],
  watch: {
    clearScreen: false
  }
}
