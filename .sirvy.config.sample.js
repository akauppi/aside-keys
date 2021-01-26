/*
* .sirvy.config.js
*
* Firebase access values to be injected to HTML. This avoids the need to store the values in the Git repo.
*/
export default {
  filter: {
    "/index-glassy.html": {
      API_KEY: '...',
      AUTH_DOMAIN: '...'
    }
  }
}
