<svelte:options tag="aside-keys" />

<script>
  import {onMount, onDestroy} from 'svelte'
  // tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
  import {backOut} from 'svelte/easing'

  import firebase from "firebase/app"
  import 'firebase/auth'

  if (!firebase.auth) throw new Error("Cannot see: firebase.auth")

  import {slideFixed} from './tools/slideFixed'

  import GoogleProvider from "./GoogleProvider.svelte";
  import { firebaseUserStore } from "./FirebaseUserStore";    // only subscribe after Firebase is initialized

  /* SVELTE NOTE:
	*		It seems mapping 'a-b' (attribute) to 'aB' (property) would be on the radar. Follow -> https://github.com/sveltejs/svelte/issues/3852
	*
	* 	Note that the use of '$$props' takes away warnings about unrelated misuse of attributes (we'd like the warnings).
	*
	* ANOTHER SVELTE NOTE: ‼️❗️️️
	* 	Getting *any* prop with just 'let abc' within a web component does not seem to work. '$$props' does. (Svelte 3.31.2)
  */
  /** NOTE: disabled for now; let's see if 'init-json' is better...
  let apiKey = $$props['api-key']
  let authDomain = $$props['auth-domain']

  if (!apiKey || !authDomain) {
    throw new Error("Please provide both 'api-key' and 'auth-domain' attributes for Firebase auth use.")
  }
  if (apiKey==='...' || authDomain==='...') {
    throw new Error("Please replace '...' with actual access values (might also be an internal bug).")
  }
  const config = {
    apiKey,
    authDomain
  };
  **/
  let initJson = $$props['init-json'];    // JSON-encoded string of '{ apiKey: ..., authDomain: ... }' |
                                          // path to fetch the auth from (e.g. '/__/firebase/init.json')

  const configProm = (async _ => {    // Promise of { apiKey: <string>, authDomain: <string> }

    if (initJson.startsWith("{")) {   // JSON string providing the values (NOT TESTED!!!)
      const { apiKey, authDomain } = JSON.parse(initJson);   // tbd. errors
      return { apiKey, authDomain };

    } else {    // a URL pointing to the config
      const resp = await fetch(initJson)    // JS note: browsers cannot 'import()' JSON (in 2021)
        .catch(err => {
          throw new Error(`Unable to read '${initJson}': ${err.message}`);
        })

      return resp.json()
        .catch( err => {
          throw new Error(`Bad JSON from '${initJson}': ${err.message}`)
        });
    }
  })();

  // Note: Potential race condition here.
  //
  //    'GoogleProvider' imports 'firebase' separate from us, and if the auth values come via a URL, their fetching
  //    takes time. Do we get them before 'GoogleProvider' uses 'firebase', and does it matter?

  // Once we know the config
  //
  const firebaseUpProm = configProm.then( config => {
    console.log("Ready to init with:", { config })

    firebase.initializeApp(config);
    console.log("Firebase initialized", config);
  });

  let visible = false;		// changing this activates the 'slideFixed' animation
  let unsub;

  onMount(async () => {
    console.log("Mounting 'aside-keys'");

    await firebaseUpProm;   // here we can wait until Firebase is initialized

    // Listen to the Firebase user status and show/hide the pane, accordingly
    //
    unsub = firebaseUserStore.subscribe(v => {
      if (v !== undefined) {		// skip initial value when state is not yet known
        visible = !v;
      }
    })
  })

  onDestroy(() => {
    unsub();
  })

  // Methods
  //
  function signOut() {
    console.log("Signing OUT")
    firebase.auth().signOut();
  }

  export {    // methods exposed
    signOut
  }
</script>

{#if visible}
	<aside part="frame" transition:slideFixed={{ duration: 600, easing: backOut }} >
		<slot />
		<GoogleProvider />
	</aside>
{/if}

<style>
	aside {
		position: fixed;
		top: 0;
		/* 'right' is animated by 'slideFixed' */

		width: 21.5em;
		padding: 1em;

		/*border: 1px solid red;*/
		border-radius: 1em;

		/* Negative right margin allows easings that bounce over the end to be used, without a gap showing up between the
		* pane and the edge of the viewport (it "eats" some from the 'width').
	  */
		margin-right: -3em;
	}
</style>
