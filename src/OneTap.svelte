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

  // Svelte note:
  //  - 'let client' should work, but gives 'undefined' :(
  //  - '$$props['client']' works
  //
  //let client;   // "blah...-...halb.apps.googleusercontent.com"

  const client = $$props['client'];    // YES!

  if (!client) {    // tbd. enable once we get a value
    throw new Error("Missing 'client'")
  }
</script>

<div>
  <h1>client { client }</h1>
</div>
