<!--
- src/FirebaseAuth.svelte
-
- Code for Firebase or Google Identity Platform authentication
-
- References:
-   - ...tbd.
-->
<script>
  import firebase from 'firebase/app'

  import { onMount } from 'svelte'
  import { fbUserStoreGen } from "./FirebaseAuthStore"

  // Svelte note: bare 'let apiKey' does NOT work here (it should); Svelte 3.31.2
  let [apiKey, authDomain] = [
    $$props['apiKey'],
    $$props['authDomain']
  ]

  if (!apiKey || !authDomain) {
    throw new Error("Please provide both 'api-key' and 'auth-domain' attrs.")
  }

  /*** remove?
  onMount( () => {
    const unsub = fbUserStoreGen().subscribe( v => {
      if (v === undefined) {

      } else if (v) {

      } else {

      }
    })

  })
  ***/
</script>

<div>
  <h1>API Key { apiKey }</h1>
</div>
