<svelte:options tag="aside-keys" />

<script>
  import {onMount, onDestroy} from 'svelte'
  // tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
  import {backOut} from 'svelte/easing'

  import {slideFixed} from './tools/slideFixed'

  import GoogleProvider from "./GoogleProvider.svelte";
  import { firebaseUserStore } from "./FirebaseUserStore";    // only subscribe after Firebase is initialized

  /** SVELTE NOTE:
	*		It seems mapping 'a-b' (attribute) to 'aB' (property) would be on the radar. Follow -> https://github.com/sveltejs/svelte/issues/3852
	*
	* 	Note that the use of '$$props' takes away warnings about unrelated misuse of attributes (we'd like the warnings).
	*
	* ANOTHER SVELTE NOTE: ‼️❗️️️
	* 	Getting *any* prop with just 'let abc' within a web component does not seem to work. '$$props' does. (Svelte 3.31.2)
  *_/
  let apiKey = $$props['api-key']
  let authDomain = $$props['auth-domain']

  if (!apiKey || !authDomain) {
    throw new Error("Please provide both 'api-key' and 'auth-domain' attributes for Firebase auth use.")
  }
  if (apiKey==='...' || authDomain==='...') {
    throw new Error("Please replace '...' with actual access values (might also be an internal bug).")
  }
  **/

  // Firebase is initialized by the application. It explicitly calls 'start()' to give us a go-ahead (tbd. would
  // 'onMount' work).
  //
  // Note: The alternative would be for us to run a secondary "Firebase application" (it's just a handle). We'd need
  //    API key and auth domain from the (real) app, for that.
  //
  let visible = false;		// changing this activates the 'slideFixed' animation
  let unsub;

  function start() {    // () => ()
    console.log("Starting 'aside-keys'");

    // Listen to the Firebase user status and show/hide the pane, accordingly
    //
    unsub = firebaseUserStore.subscribe(v => {
      if (v !== undefined) {		// skip initial value when state is not yet known
        visible = !v;
      }
    })
  }

  onDestroy(() => {
    unsub();
  })

  function signOut() {
    console.log("Signing OUT")
    firebase.auth().signOut();
  }

  export {    // methods exposed
    start,
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
  :host {
    /* web components are 'display: inline' by default */
    display: block;
  }

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
