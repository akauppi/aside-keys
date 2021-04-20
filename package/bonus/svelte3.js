/*
* Sample code: represent the active user as a Svelte 3 'Readable'.
*/
import { getAuth, onAuthStateChanged } from '@firebase/auth'

import {readable} from 'svelte/store'

const auth = getAuth(fbApp);

const user = readable(undefined, set => {
  const unsub = onAuthStateChanged( auth, (user) => {
    set(user);
  });
  return unsub;
});
