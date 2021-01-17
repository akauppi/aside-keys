<svelte:options tag="private-onetap" />

<!--
- src/OneTap.svelte
-
- Code for Google One Tap for Web
-
- References:
-   - Google One Tap JavaScript API (Google docs)
-     -> https://developers.google.com/identity/one-tap/web/reference/js-reference
-->
<script>
  import { onMount } from 'svelte'

  let client;   // "blah...-...halb.apps.googleusercontent.com"

  onMount( () => {
    setTimeout(() => {
      console.log("!!!2", { client })   // still "undefined" - why??? DEBUG
    }, /*10*/ 0)

    console.log("!!!", { client })
    /*if (!client) {
      throw new Error("Missing 'client'")
    }*/
  })
</script>

<div>
  <h1>client {client}</h1>
</div>
