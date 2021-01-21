<svelte:options tag="aside-keys" />

<script>
  import {onMount, onDestroy} from 'svelte'
  // tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
  import {backOut} from 'svelte/easing'

  import firebase from "firebase/app"
  import 'firebase/auth'

  if (!firebase.auth) throw new Error("Cannot see: firebase.auth")

  console.log("!!!", {fbAuth: firebase.auth})

  import {slideFixed} from './tools/slideFixed'

  import {fbUserStoreGen} from "./FirebaseAuthStore"
  import GoogleProvider from "./GoogleProvider.svelte";

  /*** nah?
   const validProviders = new Set([
   "onetap",    // Google One Tap for Web
   ])

   //PROPS
   export let providers = "onetap";    // eg. "abc def"
   // /PROPS

   const providersSet = new Set(providers.split(' '));    // [ "google", ... ]
   if (providersSet.size === 0) {
		throw new Error(`No 'providers' provided. Please provide at least one of: ${validProviders.join(', ')}`)
	}

   const bad = [...providersSet].filter(v => !validProviders.has(v))

   if (bad.length > 0) {
		throw new Error(`Unexpected 'providers': ${bad.join(', ')}`)
	}
   ***/

  /* SVELTE NOTE:
	*		It seems mapping 'a-b' (attribute) to 'aB' (property) would be on the radar. Follow -> https://github.com/sveltejs/svelte/issues/3852
	*
	* 	Note that the use of '$$props' takes away warnings about unrelated misuse of attributes (we'd like the warnings).
	*
	* ANOTHER SVELTE NOTE: ‼️❗️️️
	* 	Getting *any* prop with just 'let abc' within a web component does not seem to work. '$$props' does. (Svelte 3.31.2)
  */
  /*** disabled (not using One Tap)
   //let onetapClient;    // e.g. "1016...-...1a3lt.apps.googleusercontent.com"
   const onetapClient = $$props['onetap-client'];    // works; until Svelte does the conversion

   let aaa;                      // does NOT work!
   const aaa2 = $$props["aaa"];  // works

   console.log("!!!1", { onetapClient, aaa, aaa2 })    // { "...", undefined, "aaa" }
   ***/

  let apiKey = $$props['api-key']
  let authDomain = $$props['auth-domain']

  if (!apiKey || !authDomain) {
    throw new Error("Please provide both 'api-key' and 'auth-domain' attributes for Firebase auth use.")
  }

  const config = {
    apiKey,
    authDomain
  };

  let visible = false;		// changing this activates the 'slideFixed' animation
  let unsub;

  onMount(() => {
    firebase.initializeApp(config);

    // Listen to the Firebase user status and show/hide the pane, accordingly
    //
    unsub = fbUserStoreGen().subscribe(v => {
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
  export {
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
