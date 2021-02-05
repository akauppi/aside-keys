// vite.config.js

export default {
  root: 'demo',
  build: {
    // default Vite target is okay
    minify: true
  },

  // This doesn't cut it, from config file (vite 2.0.0-beta.61). Using it as command line parameter does. Weird.
  clearScreen: false
}
