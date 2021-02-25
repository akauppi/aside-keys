<svelte:options tag="aside-keys" />

<!--
- Instance part.
-
- This is responsible for the visual side. ~~Allows initialization with attributes, at least for now.~~ (tbd. remove tail)
-->
<script>
  // tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
  import {backOut} from 'svelte/easing'

  import {slideFixed} from './tools/slideFixed'

  import GoogleProvider from "./GoogleProvider.svelte";
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
  import { getAuth } from 'firebase/auth'
  import {writable} from 'svelte/store'

  // Our things show to the instances, but not the other way round.

  function assert(cond, msg) {
    if (!cond) throw new Error(msg);
  }

  // Svelte notes:
  //    We NEED to make this a store (either 'readable' or 'writable') for the HTML template to be able to follow
  //    a value from _module_ scope. '$:' does not work here.
  //
  //    'readable' would be nice, but its initialization with 'init(fah)' causes a chicken/egg chase 🐔🐣 the author
  //    couldn't solve. Thus, 'writable' it is (we don't expose it so it's all right..).
  //
  //    [If you needed to expose a writable as readable, do a 'computed'.]
  //
  const user = writable(undefined);   // Store of undefined | null | { ..Firebase user object }  ; used by the HTML template
  let myFbAuth;    // undefined | FirebaseApp; used by HTML template and provider-specific components

  let unsub;    // () => (); we don't expose it

  function init(fbAuth) {   // (Firebase Auth) => Promise of ()
    myFbAuth = fbAuth;

    unsub = fbAuth.onAuthStateChanged( (v) => {
      assert(v !== undefined, "Unexpected 'undefined' from '.onAuthStateChanged'");   // it used to give 'undefined' but seems no more (firebase 8.2.9)
      user.set(v);
    });

    // Note: Keeping the promise-returning unrelated to the above code (freedom to dump this).
    //
    const prom = new Promise( (resolved,rejected) => {
      const unsub2 = fbAuth.onAuthStateChanged(v => {
        resolved();
        unsub2();
      });
    });

    return prom;
  }

  export {
    init
  }
</script>

<!--
- tbd. try not removing the nodes, but just sliding them out of sight when 'user' changes (does work now, though..)
-->
{#if $user === null && myFbAuth}
	<aside part="frame" transition:slideFixed={ {duration: 600, easing: backOut} } >
		<slot />
    <GoogleProvider fbAuth={myFbAuth}/>
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
