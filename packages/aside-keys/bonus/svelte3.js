/*
* Sample code: represent the active user as a Svelte 3 'Readable'.
*/
import firebase from 'firebase/app'
import '@firebase/auth'

import {readable} from 'svelte/store'

const user = readable(undefined, set => {
  const unsub = firebase.auth().onAuthStateChanged( (user) => {
    set(user);
  });
  return unsub;
});
