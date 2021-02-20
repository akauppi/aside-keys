<svelte:options tag="aside-keys" />

<!--
- Instance part.
-
- This is responsible for the visual side. ~~Allows initialization with attributes, at least for now.~~ (tbd. remove tail)
-->
<script>
  import {onDestroy} from 'svelte'
  // tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
  import {backOut} from 'svelte/easing'

  import {slideFixed} from './tools/slideFixed'

  import GoogleProvider from "./GoogleProvider.svelte";

  /** disabled (initializing only by the '.init' export, and by a Firebase app handle)
  //PROPS
  /** SVELTE NOTE:
	*		It seems mapping 'a-b' (attribute) to 'aB' (property) would be on the radar. Follow -> https://github.com/sveltejs/svelte/issues/3852
	* 	Note: use of '$$props' takes away warnings about unrelated misuse of attributes (we'd like the warnings).
  *_/
  let apiKey = $$props['api-key'];
  let authDomain = $$props['auth-domain'];
  ///PROPS

  let unsub;

  // When 'apiKey' or 'authDomain' are known, take care of initialization.
  //
  $: if (apiKey && authDomain) {
    unsub = init({ apiKey, authDomain });
  }

  onDestroy(() => {
    unsub();
  })

  export {    // props and methods exposed
    apiKey,
    authDomain
  }
  **/
</script>

<!--
- Initialization and access helpers, so the app author doesn't need to deal with Firebase auth API (unless they want to).
-
- Svelte module notes:
-   - Gets here (module initialization) first, before the instance script.
-   - declarations available for the instances
-   - Svelte '$:' not allowed within module script.
-   - modules imported here are also visible in the instance code (normal 'script').
-->
<script context="module">
  import firebase from 'firebase/app'
  import '@firebase/auth'
  import {writable} from 'svelte/store'

  // Our things show to the instances, but not the other way round.

  function assert(cond, msg) {
    if (!cond) throw new Error(msg);
  }

  // Singleton state
  //
  let user = writable(undefined);

  let unsub;    // function for releasing the resources taken in 'init' (not currently exposed)

  let myApp;    // undefined | FirebaseApp

  /*
  * Initialize the whole authentication system.
  *
  * Returns a Promise that can be used to see, when the authentication state is known (some ms's after the call).
  *   This is merely a helper function; same can be reached by listening to the first user entry.
  */
  function init(fah) {   // (FirebaseApp) => Promise of ()
    assert(fah.auth, "INTERNAL ERROR: Firebase auth not properly initialized.");
      // this would be an indication of eg. bad module mapping (has happened with Vite)

    unsub = fah.auth().onAuthStateChanged( (v) => {
      assert( v !== undefined );
      user.set(v);
    });

    myApp = fah;
  }

  // Subscribe to hearing of user changes.
  //
  function onUserChange(f) {   // ( (null | { ..Firebase user object }) => () ) => () => ()    // unsub function
    const unsub = user.subscribe( v => {
      if (v !== undefined) f(v);
    });
    return unsub;
  }

  // Helper: sign out
  //
  function signOut() {   // () => Promise of ()
    return myApp.auth().signOut();
  }

  export {
    init,
    onUserChange,
    signOut
  }
</script>

<!--
- tbd. try not removing the nodes, but just sliding them out of sight when 'user' changes (does work now, though..)
-->
{#if $user === null && myApp !== undefined}
	<aside part="frame" transition:slideFixed={ {duration: 600, easing: backOut} } >
		<slot />
    <GoogleProvider app={myApp}/>
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
