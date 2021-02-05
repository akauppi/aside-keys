/*
* src/FirebaseUserStore.js
*
* A Svelte readable store about the currently logged in user (or lack thereof).
*
* Usage:
*   <<
*     import { firebaseUserStore }
*     ...
*     firebase.initializeApp(...);
*
*     ...
*     firebaseUserStore.subscribe( v => { ... } );
*   <<
*
* Note: subscription activates the interaction with Firebase and *must not be done* before the application has
*   initialized Firebase in the manner above.
*/
import firebase from 'firebase/app'
import '@firebase/auth'       // importing so that application maybe doesn't need to

import {readable} from "svelte/store"

// Returns a readable store of:
//  - undefined: initial value, signin/signout status unknown (but has been asked from Firebase)
//  - { email, uid, ... }: active user
//  - null: no active user
//
// ES modules are read only once. This provides us with a natural singleton.
//
// Note: Initializing the 'readable' _can_ be fone at module load. Things only activate once it's being subscribed to.
//
const firebaseUserStore = readable(
undefined, // initial state
(set) => {    // "called when the store gets its first subscriber"

  if (!firebase?.auth) {
    throw new Error("Internal error: Failed to load 'firebase.auth'!")
  }

  const unsub = firebase.auth().onAuthStateChanged( (user) => {
    if (user) {   // signed in
      const { email } = user;
      // ...
      console.log(`user ${email} is signed in`);
      set(user)   // expose everything we got from Firebase
    } else {    // signed out
      console.log("user is signed out");
      set(null)
    }
  });

  return /*stop*/ () => {  // "called when the last subscriber unsubscribes"
    unsub()
  }
});

export {
  firebaseUserStore
}
