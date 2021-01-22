// .env.online.js
//
// Copies of Firebase application details. Read by the browser.
//
// These are needed because we host development front-end with <strike>Vite</strike> Sirv, not Firebase hosting.
//
const firebase = {
  apiKey: '...',
  authDomain: '...'
}

export { firebase }
