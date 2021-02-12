<svelte:options tag="aside-keys" />

<!--
- Instance part.
-
- This is responsible for the visual side. Allows initialization with attributes, at least for now.
-->
<script>
  import {onDestroy} from 'svelte'
  // tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
  import {backOut} from 'svelte/easing'

  import {slideFixed} from './tools/slideFixed'

  import GoogleProvider from "./GoogleProvider.svelte";

  //PROPS
  /** SVELTE NOTE:
	*		It seems mapping 'a-b' (attribute) to 'aB' (property) would be on the radar. Follow -> https://github.com/sveltejs/svelte/issues/3852
	* 	Note: use of '$$props' takes away warnings about unrelated misuse of attributes (we'd like the warnings).
  */
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
</script>

<!--
- Central initialization and access functions, so code can steer and benefit from authentication without needing to
- be aware of the 'aside-keys' visual side.
-
- eg. signing out with 'import { signOut } from "aside-keys"'
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

  /*** REMOVE?
  // NOTE: These cause Svelte console warnings, but the trick seems otherwise to succeed (Svelte 3.32.1):
  //  <<
  //    (!) Plugin svelte: Src has unused export property 'onUser'. If it is for external reference only, please consider using `export const onUser`
  //    src/index.svelte
  //  <<
  //
  //let onUser, signOut;
  ***/

  // Singleton state; these are available for the instance
  //
  // Note that the instance has 'onDestroy' but we're not aware of a similar way for the module (likely because a loaded
  // ES module never goes out?). That's why 'unsub' is called from the instance side.
  //
  let myApp;        // undefined | Firebase "application" handle
  let user = writable(undefined);

  /*
  * Initialize the whole authentication system.
  *
  * Can be called by the web application, or indirectly by it setting the tag attributes.
  *
  * Returns an 'unsub' function for releasing the resources. Most apps will likely not call it, but keep the auth
  * running without end.
  */
  function init({apiKey, authDomain}) {   // ({...}) => () => Promise of ()
    if (myApp) {
      throw new Error("'myApp' already initialized; using two 'aside-keys' should not be necessary");
    }

    myApp = firebase.initializeApp({ apiKey, authDomain }, 'aside-keys');   // having a name makes it non-default!

    if (!myApp.auth) {   // this would be an indication of eg. bad module mapping (has happened with Vite)
      throw new Error("INTERNAL ERROR: Firebase auth not properly initialized.");
    }

    const f = myApp.auth().onAuthStateChanged( (v) => {
      assert( v !== undefined );
      user.set(v);
    });

    return () => {
      f();  // stop listening to changes

      const prom = myApp.delete()
        .catch(err => {
          console.error("INTERNAL ERROR deleting app:", err);
          throw err;
        });
      return prom;
    }
  }

  // Subscribe to hearing of user changes.
  //
  function onUserChange(f) {   // ( (null | { ..Firebase user object }) => () ) => () => ()    // unsub function
    const unsub = user.subscribe( v => {
      if (v !== undefined) f(v);
    });
    return unsub;
  }

  /*
  * A Promise that resolves when the auth initialization is done.
  */
  const isReadyProm = new Promise( (resolve,reject) => {    // Promise of ()
    const unsub = user.subscribe( v => {
      if (v !== undefined) {
        resolve();
        unsub();
      }
    });
  });

  /*** disabled (app can do it based on 'onUserChange')
  // Provide a function for asking the current user. The Promise is resolved once Firebase knows its authentication
  // state (so 'undefined' is never being returned by the provided function).
  //
  // Used by eg. front side routing; places where the "current user" is a changing entity.
  //
  // () => Promise of () => null | { ..Firebase auth object }
  //
  const getCurrentUserProm = new Promise( (resolve /_*,reject*_/) => {
    const unsub = user.subscribe( user => {
      assert( user !== undefined);    // is it true??? tbd.
      if (user !== undefined) {
        unsub();
        resolve( () => user.get() );
      }
    });
  });
  ***/

  // Sign out
  //
  function signOut() {    // () => Promise of ()
    const prom = myApp.auth().signOut();

    return prom.catch( err => {
      console.error("Signing out failed:", err);
      throw err;    // for the application error handler (may provide eg. centralized logging)
    })
  }

  export {
    init,
    isReadyProm,
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
