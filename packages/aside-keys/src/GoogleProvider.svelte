<!--
- src/GoogleProvider.svelte
-
- Button and code for logging in via Google
-
- References:
-   - "Sign-In Branding Guidelines" (Google Identity docs)
-     -> https://developers.google.com/identity/branding-guidelines
-->

<!-- Load the right font (Google branding) -->
<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
  </style>
</svelte:head>

<script>
  import firebase from 'firebase/app'
  import '@firebase/auth'

  import GLogo from './GoogleProvider/GLogo.svelte'

  function assert(cond,msg) {
    if (!cond) throw new Error(msg);
  }

  //PROPS
  export let app;     // Firebase "app" handle      // <-- Q: How to make this compulsory? #Svelte #help
  export let light = false;    // Boolean
  ///PROPS

  const theme = {   // Google theming
    bgColor: light ? '#FFFFFF' : '#4285F4',
    fontColor: light ? '#757575' : '#fff',
    //...
  }

  assert(app, "Missing 'app' attribute");
  assert(app.auth);

  let el;   // <div> (from 'onMounted' onwards)

  function pressed() {
    el.classList.add('pressed');

    // #byway since CSS not available
    el.style.boxShadow = 'none';
    el.style.transform = 'translate(2px,2px)';
  }

  function unpressed() {
    el.classList.remove('pressed');

    // #byway since CSS not available
    el.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.2)';
    el.style.transform = 'none';
  }

  /*** ancient note
  // Assets are brought in via '@rollup/plugin-image' which compiles them into DOM nodes.
  //
  // Implementation note: Instead of injecting the imported note, we just steal its 'src' field to the template (simpler
  //    and allows 'alt' placement in a normal way).
  //
  // NOTE: This did not really fly. Especially setting 'background-image: url(...)' seemed impossible (tried many ways)
  //      and did not want to use an 'img'. Thus ended duplicating the SVG (edited), as part of the repo.
  //
  import svgLightNormal from './GoogleProvider/vector/btn_google_light_normal_ios.svg'
  console.log(svgLightNormal)

  onMount( () => {
    el.style.backgroundImage = `url('${ svgLightNormal.src }')`;
  })
  ***/

  const provider = new firebase.auth.GoogleAuthProvider();
    //
    // Note: additional roles can be an added feature. Just need to pass them via attrs ('roles=...[ ...]') and
    //    document.
    //    Same with "custom parameters" - if someone has a use case, let's bridge them. :)

  function signIn() {

    app.auth()
      .signInWithPopup(provider)
      .then( res => {
        // Don't need to do anything. A central Firebase auth change listener informs the app (or already has).
        const { credential, user } = res;
        const token = credential.accessToken;

        console.log("Signed in:", { token, user });
      })
      .catch( err => {
        const { code, message, credential } = err;
        console.error("Authentication failed:", { code, message, credential })

        alert(`Authentication failed:\n\n${message}`);
      });
  }
</script>

<!-- tbd. 'backgound-image' doesn't do its job (why?) Would prefer not to make an 'img'. Compare with https://developers.google.com/identity/branding-guidelines
-       for correct output (both light and dark).
-
-   - Maybe 'background-image' does not support data URLs (yep)
-->
<!-- WARNING!!! Be EXTRA CAREFUL with the ';' in the inlined style. Syntax problems will silently change the look.
-->
<div on:click={signIn}
     on:mousedown={ pressed }
     on:mouseup={ unpressed } bind:this={el}
  style="
    position: relative;
    cursor: pointer;
    background-color: {theme.bgColor};
    color: {theme.fontColor};
    font-family: 'Roboto', sans-serif;
    user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
    height: 46px;
    width: 210px;
    margin: 0;
    padding: 0;
    border-radius: 2px;
		box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  "
>
  <GLogo />
  <span
    style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      margin-left: 20px;
    "
  >
    Sign in with Google
  </span>
</div>

<!-- PROBLEM: Why is the 'style' section not picked up??
-   Styles being dynamically created have a need to be injected in HTML (above), but the constant ones could be here. #tbd
-   #help
-->
<style>
  div {
    cursor: pointer;
    background-color: #4285F4;    /* Google branding */
    font-family: 'Roboto', sans-serif;
    /*...*/
  }

  div:hover {
    border: 1px solid rgba(255, 255, 255, 0.6);   /* (could do many things, but CSS not picked up) */
  }

  .pressed {
    box-shadow: none;
    transform: translate(2px,2px);
  }
</style>

